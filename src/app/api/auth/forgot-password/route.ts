import crypto from "crypto";
import { NextResponse } from "next/server";
import User from "@/src/models/User";
import { connectDB } from "@/src/lib/db";
import { sendResetEmail } from "@/src/lib/mail";

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("[FORGOT_PASSWORD] DB connected");

    const body = await req.json();
    const email = body?.email?.toLowerCase()?.trim();

    if (!email) {
      console.warn("[FORGOT_PASSWORD] No email provided");
      return NextResponse.json({ success: true });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[FORGOT_PASSWORD] No user found for email: ${email}`);
      return NextResponse.json({ success: true });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();
    console.log(`[FORGOT_PASSWORD] Reset token saved for user ${user._id}`);

    const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}`;

    await sendResetEmail(user.email!, resetLink);
    console.log(`[FORGOT_PASSWORD] Reset email sent to ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FORGOT_PASSWORD] Unexpected error:", error);

    // Still do not leak details to client
    return NextResponse.json({ success: true });
  }
}
