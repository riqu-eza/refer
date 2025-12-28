import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/src/lib/jwt";
import Wallet from "@/src/models/Wallet";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = await Wallet.findOne({ userId: user.id });

  return NextResponse.json({
    pointsBalance: wallet?.pointsBalance ?? 0,
    fiatBalance: wallet?.fiatBalance ?? 0,
  });
}
