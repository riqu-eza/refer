export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";


export async function GET() {
  console.log("➡️ /api/auth/me called");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    console.log("🍪 Token from cookies:", token ? "FOUND" : "NOT FOUND");

    if (!token) {
      console.log("❌ No token → returning null user");
      return NextResponse.json({ user: null });
    }

    let decoded: string | jwt.JwtPayload | undefined;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log("🔓 JWT Decoded:", decoded);
    } catch (err) {
      console.error("❌ JWT VERIFY FAILED:", err);
      return NextResponse.json({ user: null });
    }

    // Ensure decoded is an object with an 'id' property
    if (typeof decoded === "string" || decoded == null || !("id" in decoded)) {
      console.error("❌ Invalid token payload, missing id:", decoded);
      return NextResponse.json({ user: null });
    }

    const payload = decoded as jwt.JwtPayload;

    await connectDB();
    console.log("📌 Looking for user:", payload.id);

    const user = await User.findById(decoded.id).lean();
    console.log("👤 User found:", user);

    return NextResponse.json({
      user: user ? { ...user, passwordHash: undefined } : null,
    });
  } catch (err) {
    console.error("🔥 ERROR IN /api/auth/me:", err);
    return NextResponse.json({ user: null });
  }
}
