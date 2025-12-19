// src/services/convertService.ts
import Wallet from "@/src/models/Wallet";
import Transaction from "@/src/models/Transaction";

const POINTS_TO_FIAT_RATE = 10;
const MIN_POINTS_CONVERT = 10000;

export async function convertPointsToFiat(userId: string, points: number) {
  if (points < MIN_POINTS_CONVERT) {
    throw new Error("Minimum convertible points is 10,000");
  }

  if (points % POINTS_TO_FIAT_RATE !== 0) {
    throw new Error("Points must be divisible by 10");
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.pointsBalance < points) {
    throw new Error("Insufficient points balance");
  }

  const fiatAmount = points / POINTS_TO_FIAT_RATE;

  // Atomic update
  wallet.pointsBalance -= points;
  wallet.fiatBalance += fiatAmount;
  await wallet.save();

  await Transaction.create({
    userId,
    type: "POINTS_TO_FIAT",
    pointsAmount: points,
    fiatAmount,
    status: "SUCCESS",
  });

  return {
    convertedPoints: points,
    fiatReceived: fiatAmount,
    fiatBalance: wallet.fiatBalance,
  };
}
