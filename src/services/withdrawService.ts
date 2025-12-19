// src/services/withdrawService.ts
import Wallet from "@/src/models/Wallet";
import Transaction from "@/src/models/Transaction";

const MIN_WITHDRAW_FIAT = 2500;

export async function requestWithdrawal(userId: string, amount: number) {
  if (amount < MIN_WITHDRAW_FIAT) {
    throw new Error("Minimum withdrawal amount is 2,500 fiat");
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.fiatBalance < amount) {
    throw new Error("Insufficient fiat balance");
  }

  // Lock funds immediately
  wallet.fiatBalance -= amount;
  await wallet.save();

  const withdrawal = await Transaction.create({
    userId,
    type: "WITHDRAWAL",
    fiatAmount: amount,
    status: "PENDING",
  });

  return {
    message: "Withdrawal request submitted",
    transactionId: withdrawal._id,
  };
}
