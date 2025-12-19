// src/app/api/spin/status/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/src/lib/jwt";
import SpinState from "@/src/models/SpinState";
import { LEVEL_SPINS } from "@/src/config/spinConfig";
import { LEVEL_TO_NUMBER } from "@/src/lib/levelUtils";

export async function GET(req: Request) {
  const token = req.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  // 🔁 Convert level string → numeric level
  const levelNumber = LEVEL_TO_NUMBER[user.level];

  if (!levelNumber) {
    console.error("Invalid user level:", user.level);
    return NextResponse.json(
      { error: "Invalid user level configuration" },
      { status: 500 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const maxSpins = LEVEL_SPINS[levelNumber];

  const state = await SpinState.findOne({
    userId: user.id,
    lastSpinDate: today,
  });

  const spinsUsed = state?.spinsUsedToday ?? 0;

  return NextResponse.json({
    spinsLeft: Math.max(0, maxSpins - spinsUsed),
    maxSpins,
    level: user.level,
  });
}
