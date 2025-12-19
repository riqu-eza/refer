// src/services/spinService.ts
import SpinState from "@/src/models/SpinState";
import Wallet from "@/src/models/Wallet";
import SpinHistory from "@/src/models/SpinHistory";
import {
  DAILY_POINT_CAP,
  LEVEL_SPINS,
  WHEEL_BUCKETS,
} from "@/src/config/spinConfig";

function pickBucket() {
  const total = WHEEL_BUCKETS.reduce((a, b) => a + b.weight, 0);
  let rand = Math.random() * total;

  for (const bucket of WHEEL_BUCKETS) {
    if (rand < bucket.weight) return bucket;
    rand -= bucket.weight;
  }

  console.warn("⚠️ pickBucket fell through, defaulting NO_WIN");
  return WHEEL_BUCKETS[0];
}
async function ensureSpinState(userId: string, today: string) {
  try {
    await SpinState.create({
      userId,
      lastSpinDate: today,
      spinsUsedToday: 0,
      pointsEarnedToday: 0,
      spinning: false,
    });
  } catch (e: any) {
    // Ignore duplicate key error (already exists)
    if (e.code !== 11000) {
      throw e;
    }
  }
}

// src/services/spinService.ts
export async function spin(userId: string, level: number) {
  if (!userId) throw new Error("Invalid userId");
  if (!Number.isInteger(level)) throw new Error("Invalid level");

  const today = new Date().toISOString().slice(0, 10);
  const maxSpins = LEVEL_SPINS[level] ?? 3;

  // 1️⃣ Ensure document exists (safe)
  await ensureSpinState(userId, today);

  // 2️⃣ Acquire lock (NO upsert)
  const state = await SpinState.findOneAndUpdate(
    {
      userId,
      spinning: false,
      $or: [
        { lastSpinDate: today, spinsUsedToday: { $lt: maxSpins } },
        { lastSpinDate: { $ne: today } },
      ],
    },
    {
      $set: {
        spinning: true,
        lastSpinDate: today,
      },
      $inc: {
        spinsUsedToday: 1,
      },
    },
    { new: true } // ❌ NO upsert
  );

  if (!state) {
    throw new Error("Spin already in progress or daily limit reached");
  }

  try {
    if (state.lastSpinDate !== today) {
      state.spinsUsedToday = 1;
      state.pointsEarnedToday = 0;
      state.lastSpinDate = today;
    }

    const bucket = pickBucket();
    let reward =
      bucket.min === 0
        ? 0
        : Math.floor(Math.random() * (bucket.max - bucket.min + 1)) + bucket.min;

    const remaining = DAILY_POINT_CAP - state.pointsEarnedToday;
    reward = Math.max(0, Math.min(reward, remaining));

    state.pointsEarnedToday += reward;
    await state.save();

    await Wallet.findOneAndUpdate(
      { userId },
      { $inc: { pointsBalance: reward } },
      { upsert: true }
    );

    await SpinHistory.create({
      userId,
      level,
      spinResult: bucket.label,
      pointsAwarded: reward,
    });

    return {
      bucket: bucket.label,
      pointsAwarded: reward,
      spinsLeft: maxSpins - state.spinsUsedToday,
    };
  } finally {
    await SpinState.updateOne(
      { userId },
      { $set: { spinning: false } }
    );
  }
}


