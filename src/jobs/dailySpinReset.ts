// src/jobs/dailySpinReset.ts
import SpinState from "@/src/models/SpinState";

export async function resetDailySpins() {
  const today = new Date().toISOString().slice(0, 10);

  await SpinState.updateMany(
    { lastSpinDate: { $ne: today } },
    {
      $set: {
        spinsUsedToday: 0,
        pointsEarnedToday: 0,
        spinning: false,
      },
    }
  );

  console.log("🔄 Daily spin reset completed");
}
