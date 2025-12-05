export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { generateReferralCode } from "@/src/lib/shared/referral";
import { signToken } from "@/src/lib/jwt";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, phone, password, referral } = await req.json();

  const exists = await User.findOne({ phone });
  if (exists)
    return NextResponse.json({ error: "User exists" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const referralCode = generateReferralCode(phone);

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    referralCode,
    referredBy: referral || null,
  });

  // JOSE JWT
  const token = await signToken({ id: user._id.toString() });

  const res = NextResponse.json({
    message: "Registered",
    user,
  });

  res.cookies.set("session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
