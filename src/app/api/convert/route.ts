// src/app/api/convert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { convertPointsToFiat } from "@/src/services/convertService";
import { verifyToken } from "@/src/lib/jwt";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;
  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { points } = await req.json();

  try {
    const result = await convertPointsToFiat(user.id, points);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
