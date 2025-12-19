// src/app/api/spin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { spin } from "@/src/services/spinService";
import { verifyToken } from "@/src/lib/jwt";
import { LEVEL_TO_NUMBER } from "@/src/lib/levelUtils";
import User from "@/src/models/User";

export async function POST(req: NextRequest) {
  console.log("🎡 [/api/spin] Request received");

  try {
    const token = req.cookies.get("session_token")?.value;
    console.log("🍪 Token present:", !!token);

    const userInfo = await verifyToken(token);
    console.log("👤 Token decoded user:", userInfo);
    const user = await User.findById(userInfo.id); // Fetch full user details
    if (!user) {
      console.warn("⛔ Unauthorized spin attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`▶️ Starting spin for userId=${user.id}, level=${user.level}`);

    // Ensure user.level is a valid key into LEVEL_TO_NUMBER
    const levelKey = String(user.level) as keyof typeof LEVEL_TO_NUMBER;
    const numericLevel = LEVEL_TO_NUMBER[levelKey];
    if (numericLevel === undefined) {
      console.warn("⚠️ Invalid user level:", user.level);
      return NextResponse.json(
        { error: "Invalid user level" },
        { status: 400 }
      );
    }

    const result = await spin(user.id, numericLevel);

    console.log("✅ Spin success:", result);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("🔥 Spin API ERROR:", e.message, e.stack);
    return NextResponse.json(
      { error: e.message || "Spin failed" },
      { status: 400 }
    );
  }
}
