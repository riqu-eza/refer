export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { signToken } from "@/src/lib/jwt";
import argon2 from "argon2";
export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email }).lean();
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const ok = await argon2.verify(password, user.passwordHash);
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // JOSE JWT
  const token = await signToken({ id: user._id.toString() });

  const res = NextResponse.json({
    message: "Logged in",
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
