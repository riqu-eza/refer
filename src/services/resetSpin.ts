export function resetDailySpinsIfNeeded(spin: any) {
  const now = Date.now();
  const last = new Date(spin.lastResetAt).getTime();

  if (now - last >= 24 * 60 * 60 * 1000) {
    spin.dailyUsedSpins = 0;
    spin.lastResetAt = new Date();
  }
}
