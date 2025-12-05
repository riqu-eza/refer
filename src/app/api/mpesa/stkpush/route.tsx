/* eslint-disable @typescript-eslint/no-explicit-any */
import { initiateStkPush } from "@/src/services/mpesaService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Missing required fields (phoneNumber, amount)." },
        { status: 400 }
      );
    }

    const responseData = await initiateStkPush(phoneNumber, amount);

    if (responseData.ResponseCode === "0") {
      return NextResponse.json({
        message: "STK Push sent. Please check your phone and enter your M-Pesa PIN.",
        CheckoutRequestID: responseData.CheckoutRequestID,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to initiate payment", details: responseData },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
