/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Transaction from "@/src/models/Transaction";
import Wallet from "@/src/models/Wallet";
import User from "@/src/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // 1️⃣ Log raw callback
    console.log("MPESA-CALLBACK | Received:", JSON.stringify(body, null, 2));

    const callback = body.Body?.stkCallback;

    if (!callback) {
      console.log("MPESA-CALLBACK | ERROR | Missing stkCallback field");
      return NextResponse.json({ ok: true });
    }

    const checkoutRequestID = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;
    const resultDesc = callback.ResultDesc;

    // 2️⃣ Log extracted core fields
    console.log("MPESA-CALLBACK | Extracted:", {
      checkoutRequestID,
      resultCode,
      resultDesc,
    });

    // 3️⃣ Lookup the matching transaction
    const tx = await Transaction.findOne({ checkoutRequestID });

    if (!tx) {
      console.log("MPESA-CALLBACK | ERROR | No matching transaction found", {
        checkoutRequestID,
      });
      return NextResponse.json({ ok: true });
    }

    // 4️⃣ Detect duplicate callbacks
    if (tx.status !== "PENDING") {
      console.log(
        "MPESA-CALLBACK | DUPLICATE | Transaction already processed",
        {
          checkoutRequestID,
          status: tx.status,
        }
      );
      return NextResponse.json({ ok: true });
    }

    // 5️⃣ Payment FAILED
    if (resultCode !== 0) {
      console.log("MPESA-CALLBACK | FAILED | Payment not successful", {
        checkoutRequestID,
        resultDesc,
      });

      tx.status = "FAILED";
      tx.meta = { resultDesc };
      await tx.save();

      return NextResponse.json({ ok: true });
    }

    // 6️⃣ Extract metadata from callback
    const metadata = callback.CallbackMetadata?.Item || [];
    const amount = metadata.find((i: any) => i.Name === "Amount")?.Value;
    const receipt = metadata.find(
      (i: any) => i.Name === "MpesaReceiptNumber"
    )?.Value;
    const phone = metadata.find((i: any) => i.Name === "PhoneNumber")?.Value;
    const date = metadata.find((i: any) => i.Name === "TransactionDate")?.Value;

    console.log("MPESA-CALLBACK | Metadata extracted:", {
      amount,
      receipt,
      phone,
      date,
    });

    // 7️⃣ Update transaction → SUCCESS
    tx.status = "SUCCESS";
    tx.receiptNumber = receipt;
    tx.paidPhoneNumber = phone?.toString();
    tx.paidAt = new Date(
      `${date.toString().slice(0, 4)}-${date.toString().slice(4, 6)}-${date
        .toString()
        .slice(6, 8)}
       ${date.toString().slice(8, 10)}:${date.toString().slice(10, 12)}:${date
        .toString()
        .slice(12, 14)}`
    );

    await tx.save();

    console.log("MPESA-CALLBACK | Transaction updated:", {
      transactionId: tx._id,
      newStatus: "SUCCESS",
    });

    // 8️⃣ Update wallet balance
    const wallet = await Wallet.findOne({ userId: tx.userId });

    if (wallet) {
      wallet.fiatBalance += amount;
      await wallet.save();

      console.log("MPESA-CALLBACK | Wallet credited:", {
        userId: tx.userId,
        credited: amount,
        newBalance: wallet.fiatBalance,
      });
    } else {
      const newWallet = await Wallet.create({
        userId: tx.userId,
        fiatBalance: amount,
      });

      console.log("MPESA-CALLBACK | Wallet created + credited:", {
        userId: tx.userId,
        credited: amount,
        balance: newWallet.fiatBalance,
      });
    }
    if (tx.type === "ACTIVATION") {
      const user = await User.findById(tx.userId);
      if (user && !user.isActivated) {
        user.isActivated = true;
        await user.save();
        console.log("MPESA-CALLBACK | User activated:", {
          userId: tx.userId,
        });
      }
    }
    if (tx.type === "LEVEL_UPGRADE") {
      const user = await User.findById(tx.userId);

      if (!user) {
        console.error("LEVEL-UPGRADE | User not found", tx.userId);
        return NextResponse.json({ ok: true });
      }

      const targetLevel = tx.meta?.targetLevel;

      if (!targetLevel || targetLevel <= user.level) {
        console.warn("LEVEL-UPGRADE | Invalid target level", {
          current: user.level,
          targetLevel,
        });
        return NextResponse.json({ ok: true });
      }

      user.level = targetLevel;
      await user.save();

      console.log("LEVEL-UPGRADE | User upgraded", {
        userId: user._id,
        newLevel: user.level,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("MPESA-CALLBACK | ERROR:", error);
    return NextResponse.json({ ok: true });
  }
}
