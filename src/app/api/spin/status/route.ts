// src/app/api/spin/status/route.ts
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/src/lib/jwt";
import SpinState from "@/src/models/SpinState";
import { LEVEL_SPINS } from "@/src/config/spinConfig";
import { LEVEL_TO_NUMBER } from "@/src/lib/levelUtils";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔁 Convert level string → numeric level
  if (typeof user.level !== "string") {
    console.error("Invalid user level type:", typeof user.level);
    return NextResponse.json(
      { error: "Invalid user level configuration" },
      { status: 500 }
    );
  }

  const levelKey = user.level as keyof typeof LEVEL_TO_NUMBER;
  const levelNumber = LEVEL_TO_NUMBER[levelKey];

  if (levelNumber == null) {
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
