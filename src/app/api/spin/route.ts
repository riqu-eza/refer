import { connectDB } from "@/src/lib/db";
import User from "@/src/models/User";
import Wallet from "@/src/models/Wallet";
import Transaction from "@/src/models/Transaction";
import UserSpinState from "@/src/models/UserSpinState";
import { LEVEL_CONFIG } from "@/src/config/levels";
import { getAllowedRewards, rollReward } from "@/src/services/spinRewardService";

import { NextResponse } from "next/server";
import { resetDailySpinsIfNeeded } from "@/src/services/resetSpin";
import { verifyToken } from "@/src/lib/jwt";

export async function POST(req: Request) {

  await connectDB();

  // ---- AUTH ----
  const cookie = req.headers.get("cookie") || "";
console.log("[SPIN] Cookie header:", cookie);
  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("session_token="))
    ?.split("=")[1];
console.log("[SPIN] session_token:", token);
  if (!token) {
    console.warn("[SPIN] No auth_token found in cookie");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;

  try {
    const payload = await verifyToken(token);
    console.log("[SPIN] Token payload:", payload);
    userId = payload.payload.id;
    console.log("[SPIN] Token verified, userId:", userId);
  } catch (err) {
    console.error("[SPIN] Token verification failed", err);
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // ---- USER ----
  const user = await User.findById(userId);
  if (!user) {
    console.warn("[SPIN] User not found:", userId);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log("[SPIN] User level:", user.level);

  // ---- WALLET / SPIN STATE ----
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    console.error("[SPIN] Wallet missing for user:", userId);
    return NextResponse.json({ error: "Wallet not found" }, { status: 500 });
  }

  const spinState =
    (await UserSpinState.findOne({ userId })) ||
    (await UserSpinState.create({ userId }));

  console.log("[SPIN] Spin state before reset:", {
    dailyUsedSpins: spinState.dailyUsedSpins,
    extraSpins: spinState.extraSpins,
    lastResetAt: spinState.lastResetAt,
  });

  resetDailySpinsIfNeeded(spinState);

  console.log("[SPIN] Spin state after reset:", {
    dailyUsedSpins: spinState.dailyUsedSpins,
    extraSpins: spinState.extraSpins,
  });

  // ---- AVAILABILITY ----
  const levelCfg = LEVEL_CONFIG[user.level];
  const available =
    levelCfg.dailySpins - spinState.dailyUsedSpins + spinState.extraSpins;

  console.log("[SPIN] Available spins:", available);

  if (available <= 0) {
    console.warn("[SPIN] No spins left for user:", userId);
    return NextResponse.json({ error: "No spins left" }, { status: 400 });
  }

  // ---- CONSUME SPIN ----
  if (spinState.dailyUsedSpins < levelCfg.dailySpins) {
    spinState.dailyUsedSpins++;
    console.log("[SPIN] Consumed daily spin");
  } else {
    spinState.extraSpins--;
    console.log("[SPIN] Consumed extra spin");
  }

  // ---- ROLL REWARD ----
  const rewards = getAllowedRewards(user.level);
  console.log("[SPIN] Allowed rewards:", rewards);

  const result = rollReward(rewards);
  console.log("[SPIN] Rolled reward:", result);

  const slotIndex = rewards.findIndex((r) => r.key === result.key);
  console.log("[SPIN] slotIndex:", slotIndex);

  // ---- APPLY REWARD ----
  if (result.type === "POINTS") {
    wallet.pointsBalance += result.value;
    console.log("[SPIN] Added points:", result.value);
  }

  if (result.type === "FIAT") {
    wallet.fiatBalance += result.value;
    console.log("[SPIN] Added fiat:", result.value);
  }

  if (result.type === "SPIN") {
    spinState.extraSpins += result.value;
    console.log("[SPIN] Added bonus spins:", result.value);
  }

  if (result.type !== "NONE") {
    await Transaction.create({
      userId,
      type: "SPIN_REWARD",
      amount: result.value,
      currency: result.type === "POINTS" ? "POINTS" : "FIAT",
      status: "SUCCESS",
      meta: { rewardKey: result.key },
    });

    console.log("[SPIN] Transaction recorded");
  }

  // ---- SAVE ----
  await wallet.save();
  await spinState.save();

  console.log("[SPIN] Spin completed successfully");

  return NextResponse.json({
    slotIndex,
    reward: result,
    remainingSpins:
      levelCfg.dailySpins - spinState.dailyUsedSpins + spinState.extraSpins,
  });
}

