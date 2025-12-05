import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("M-Pesa Callback Data:", JSON.stringify(body, null, 2));
  const resultCode = body?.Body?.stkCallback?.ResultCode;
  const checkoutId = body?.Body?.stkCallback?.CheckoutRequestID;
  
  if (resultCode !== 0) {
    return NextResponse.json({ message: "Payment failed" });
  }

  const phone = body.Body.stkCallback.CallbackMetadata.Item[4].Value;

  await connectDB();

  // Find the user and activate
  await User.findOneAndUpdate({ phone }, { isActivated: true });
  return NextResponse.json({ message: "Callback received successfully" });
}
