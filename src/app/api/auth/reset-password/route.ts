import crypto from "crypto";
// import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/src/models/User";
import { connectDB } from "@/src/lib/db";
import argon2 from "argon2";
export async function POST(req: Request) {
  try {
    console.log("[RESET_PASSWORD] Request received");

    await connectDB();
    console.log("[RESET_PASSWORD] DB connected");

    const body = await req.json();
    const { token, password } = body || {};

    if (!token || !password) {
      console.warn("[RESET_PASSWORD] Missing token or password");
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    console.log("[RESET_PASSWORD] Payload validated");

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("[RESET_PASSWORD] Token hashed");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      console.warn(
        "[RESET_PASSWORD] No matching user (invalid or expired token)"
      );
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    console.log(
      `[RESET_PASSWORD] User found: ${user._id.toString()}`
    );

    user.passwordHash = await argon2.hash(password);
    console.log("[RESET_PASSWORD] Password hashed");

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.sessionTokens = [];

    await user.save();
    console.log("[RESET_PASSWORD] Password updated & sessions cleared");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESET_PASSWORD] Unexpected error:", error);

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
