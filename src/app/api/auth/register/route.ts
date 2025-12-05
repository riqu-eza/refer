import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { generateReferralCode } from "@/src/lib/shared/referral";
import { truncate } from "node:fs/promises";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, phone, password, referral } = await req.json();

  // Check existing user
  const exists = await User.findOne({ phone });
  if (exists)
    return NextResponse.json({ error: "User exists" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const referralCode = generateReferralCode(phone);

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    referralCode,
    referredBy: referral || null,
  });

  // Create JWT
  const token = jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Prepare response
  const res = NextResponse.json({
    message: "Registered",
    user,
  });

  // Set cookie
  res.cookies.set("session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
