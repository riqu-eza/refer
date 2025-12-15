import { connectDB } from "@/src/lib/db";
import { addDailyFiatInterest } from "@/src/services/walletService";

export async function runDailyInterestJob() {
  try {
    await connectDB();
    await addDailyFiatInterest(); // Default 10%
  } catch (err) {
    console.error("Daily interest job failed:", err);
  }
}
