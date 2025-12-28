// src/app/api/payments/upgrade/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import Transaction from "@/src/models/Transaction";
import User from "@/src/models/User";
import { initiateStkPush } from "@/src/services/mpesaService";
import { LEVEL_CONFIG, LevelId } from "@/src/config/levels";
import { verifyToken } from "@/src/lib/jwt";
export async function POST(req: NextRequest) {
  await connectDB();

  const { phoneNumber, targetLevel } = (await req.json()) as {
    phoneNumber: string;
    targetLevel: LevelId;
  };
  // console.log("Request body:", { phoneNumber, targetLevel });
  if (!phoneNumber || !targetLevel) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const token = req.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  // If verifyToken returns null or doesn't include an id, reject as unauthorized
  if (!payload || !("id" in payload) || !payload.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Payload:", payload);
  const userId = payload.id;
  // const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const currentLevelConfig = LEVEL_CONFIG[user.level as LevelId];
  const targetLevelConfig = LEVEL_CONFIG[targetLevel];
  console.log("Current Level Config:", currentLevelConfig);
  console.log("Target Level Config:", targetLevelConfig);
  if (!targetLevelConfig) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  // Prevent downgrade or re-purchase
  if (currentLevelConfig.level >= targetLevelConfig.level) {
    return NextResponse.json(
      { error: "Cannot downgrade or re-purchase same level" },
      { status: 400 }
    );
  }

  const amount = targetLevelConfig.price;

  // 1️⃣ Create pending transaction
  const tx = await Transaction.create({
    userId,
    type: "LEVEL_UPGRADE",
    amount,
    currency: "FIAT",
    status: "PENDING",
    meta: {
      fromLevel: user.level,
      targetLevel,
    },
    paidPhoneNumber: phoneNumber,
  });

  // 2️⃣ Initiate STK Push
  const response = await initiateStkPush(phoneNumber, amount);

  if (response.ResponseCode !== "0") {
    tx.status = "FAILED";
    tx.meta.error = response;
    await tx.save();

    return NextResponse.json(
      { error: "STK initiation failed" },
      { status: 500 }
    );
  }

  tx.checkoutRequestID = response.CheckoutRequestID;
  tx.merchantRequestID = response.MerchantRequestID;
  await tx.save();

  return NextResponse.json({
    message: "STK Push sent",
    transactionId: tx._id,
  });
}
