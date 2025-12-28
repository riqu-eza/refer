export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { verifyJWT } from "@/src/lib/jwt";

export async function GET() {
  console.log("➡️ /api/auth/me called");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    console.log("🍪 Token:", token ? "FOUND" : "NOT FOUND");

    if (!token) return NextResponse.json({ user: null });

    let decoded;
    try {
      decoded = await verifyJWT(token);
      if (!decoded) {
        console.error("❌ JWT VERIFY RETURNED NULL");
        return NextResponse.json({ user: null });
      }
      console.log("🔓 JWT Decoded:", decoded.payload);
    } catch (err) {
      console.error("❌ JWT VERIFY FAILED:", err);
      return NextResponse.json({ user: null });
    }

    const id = decoded.payload.id;
    if (!id) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(id).lean();

    return NextResponse.json({
      user: user ? { ...user, passwordHash: undefined } : null,
    });

  } catch (err) {
    console.error("🔥 ERROR IN /api/auth/me:", err);
    return NextResponse.json({ user: null });
  }
}
