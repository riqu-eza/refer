import { NextResponse } from "next/server";
import { runDailyInterestJob } from "@/src/jobs/dailyInterest";
import { connectDB } from "@/src/lib/db";

export async function GET() {
  try {
    await connectDB();
    await runDailyInterestJob();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CRON ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
