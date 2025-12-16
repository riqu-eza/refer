export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { signToken } from "@/src/lib/jwt";
import argon2 from "argon2";

export async function POST(req: Request) {
  try {
    console.log("[LOGIN] Request received");

    await connectDB();
    console.log("[LOGIN] DB connected");

    const body = await req.json();
    const { identifier, password } = body || {};
    console.log("[LOGIN] Payload parsed", body);
    if (!identifier || !password) {
      console.warn("[LOGIN] Missing identifier or password");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    console.log("[LOGIN] Identifier received");

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    }).lean();

    if (!user) {
      console.warn(`[LOGIN] User not found for identifier: ${identifier}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`[LOGIN] User found: ${user._id.toString()}`);

    const ok = await argon2.verify(user.passwordHash, password);

    if (!ok) {
      console.warn("[LOGIN] Password verification failed");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("[LOGIN] Password verified");

    const token = await signToken({ id: user._id.toString() });
    console.log("[LOGIN] Session token created");

    const res = NextResponse.json({
      message: "Logged in",
      user,
    });

    res.cookies.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    console.log("[LOGIN] Session cookie set");

    return res;
  } catch (error) {
    console.error("[LOGIN] Unexpected error:", error);

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
