export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await connectDB();

  try {
    const user = await User.findById(params.userId).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { referralLevels } = user;

    // Fetch users by tiers
    const [tier1, tier2, tier3] = await Promise.all([
      User.find({ _id: { $in: referralLevels?.tier1 || [] } })
        .select("name phone isActivated")
        .lean(),

      User.find({ _id: { $in: referralLevels?.tier2 || [] } })
        .select("name phone isActivated")
        .lean(),

      User.find({ _id: { $in: referralLevels?.tier3 || [] } })
        .select("name phone isActivated")
        .lean(),
    ]);

    return NextResponse.json({
      directReferrals: tier1,
      tier2Referrals: tier2,
      tier3Referrals: tier3,
    });
  } catch (error) {
    console.error("Referral fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
