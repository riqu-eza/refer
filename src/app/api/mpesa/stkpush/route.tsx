/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Transaction from "@/src/models/Transaction";
import User from "@/src/models/User";
import { initiateStkPush } from "@/src/services/mpesaService";



export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { phoneNumber, amount, userId } = await req.json();
    if (!phoneNumber || !amount || !userId) {
      return NextResponse.json(
        { error: "Missing required fields (phoneNumber, amount, userId)." },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 1️⃣ Create pending transaction
    const transaction = await Transaction.create({
      userId,
      type: "ACTIVATION",
      amount,
      currency: "FIAT",
      status: "PENDING",
      paidPhoneNumber: phoneNumber,
    });

    // 2️⃣ Initiate STK
    const responseData = await initiateStkPush(phoneNumber, amount);

    if (responseData.ResponseCode !== "0") {
      transaction.status = "FAILED";
      transaction.meta = { error: responseData };
      await transaction.save();

      return NextResponse.json(
        { error: "Failed to initiate payment", details: responseData },
        { status: 500 }
      );
    }

    // 3️⃣ Save checkout IDs
    transaction.merchantRequestID = responseData.MerchantRequestID;
    transaction.checkoutRequestID = responseData.CheckoutRequestID;

    await transaction.save();

    return NextResponse.json({
      message: "STK Push sent. Complete payment on your phone.",
      transactionId: transaction._id,
      checkoutRequestID: transaction.checkoutRequestID,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
