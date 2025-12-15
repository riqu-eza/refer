export const runtime = "nodejs";

import { NextResponse } from "next/server";
import argon2 from "argon2";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import { generateReferralCode } from "@/src/lib/shared/referral";
import { signToken } from "@/src/lib/jwt";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { name, email, phone, password, referral } = await req.json();

    // 1. Validate basic fields
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const exists = await User.findOne({ phone });
    if (exists)
      return NextResponse.json({ error: "User exists" }, { status: 400 });

    // 3. Hash password
    const passwordHash = await argon2.hash(password);

    // 4. Generate new referralCode
    const referralCode = generateReferralCode(phone);

    // 5. Prepare user object
    const newUser = new User({
      name,
      email,
      phone,
      passwordHash,
      referralCode,
      referredBy: referral || null,
    });

    // 6. Handle referral logic if referral code provided
    if (referral) {
      // Tier 1 referrer
      const tier1 = await User.findOne({ referralCode: referral });

      if (tier1) {
        // Add this user as Tier 1 for tier1 user
        tier1.referralLevels.tier1.push(newUser._id.toString());
        tier1.xp += 50; // XP reward
        await tier1.save();

        // Tier 2 referrer (referrer of the referrer)
        if (tier1.referredBy) {
          const tier2 = await User.findOne({
            referralCode: tier1.referredBy,
          });

          if (tier2) {
            tier2.referralLevels.tier2.push(newUser._id.toString());
            tier2.xp += 20;
            await tier2.save();

            // Tier 3 referrer
            if (tier2.referredBy) {
              const tier3 = await User.findOne({
                referralCode: tier2.referredBy,
              });

              if (tier3) {
                tier3.referralLevels.tier3.push(newUser._id.toString());
                tier3.xp += 10;
                await tier3.save();
              }
            }
          }
        }
      }
    }

    // 7. Save new user
    await newUser.save();

    // 8. Create JWT
    const token = await signToken({ id: newUser._id.toString() });

    const res = NextResponse.json({
      message: "Registered",
      user: newUser,
    });

    // 9. Set session cookie
    res.cookies.set("session_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
