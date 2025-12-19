// src/app/api/withdraw/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requestWithdrawal } from "@/src/services/withdrawService";
import { verifyToken } from "@/src/lib/jwt";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  try {
    const result = await requestWithdrawal(user.id, amount);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
