// src/app/api/wallet/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/jwt";
import Wallet from "@/src/models/Wallet";

export async function GET(req: Request) {
  const token = req.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  const wallet = await Wallet.findOne({ userId: user.id });

  return NextResponse.json({
    pointsBalance: wallet?.pointsBalance ?? 0,
    fiatBalance: wallet?.fiatBalance ?? 0,
  });
}
