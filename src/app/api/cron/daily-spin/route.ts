// src/app/api/cron/daily-spin/route.ts
import { resetDailySpins } from "@/src/jobs/dailySpinReset";

export async function GET() {
  await resetDailySpins();
  return Response.json({ ok: true });
}
