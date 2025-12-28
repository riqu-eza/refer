import { connectDB } from "@/src/lib/db";
import { verifyToken } from "@/src/lib/jwt";
import User from "@/src/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  try {
    const token = req.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

const decoded = await verifyToken(token);
console.log("Decoded token:", decoded);
// ✅ jose-style payload
if (!decoded || !decoded.id) {
  return NextResponse.json(
    { error: "Invalid token payload" },
    { status: 401 }
  );
}

const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select(
      "-passwordHash -sessionTokens"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch referral user details
    const tier1Users = await User.find({
      _id: { $in: user.referralLevels.tier1 },
    }).select("name phone createdAt");

    const tier2Users = await User.find({
      _id: { $in: user.referralLevels.tier2 },
    }).select("name phone createdAt");

    const tier3Users = await User.find({
      _id: { $in: user.referralLevels.tier3 },
    }).select("name phone createdAt");

    return NextResponse.json({
      message: "Success",
      profile: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        xp: user.xp,
        level: user.level,

        referralLevels: {
          tier1: tier1Users,
          tier2: tier2Users,
          tier3: tier3Users,
        },

        counts: {
          tier1: tier1Users.length,
          tier2: tier2Users.length,
          tier3: tier3Users.length,
        },
      },
    });
  } catch (error) {
    console.error("PROFILE API ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
