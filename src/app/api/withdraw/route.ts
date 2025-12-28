
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requestWithdrawal } from "@/src/services/withdrawService";
import { verifyToken } from "@/src/lib/jwt";

export async function POST(req: NextRequest) {
  // App Router cookie access
  const cookieStore = cookies();
  const token = (await cookieStore).get("session_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // MUST await async auth
  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  try {
    const result = await requestWithdrawal(user.id, amount);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Withdrawal failed" },
      { status: 400 }
    );
  }
}
