import Wallet from "@/src/models/Wallet";
import Transaction from "@/src/models/Transaction";

export async function addDailyFiatInterest(percentage: number = 0.1) {
  const wallets = await Wallet.find({ fiatBalance: { $gt: 0 } });

  for (const wallet of wallets) {
    try {
      const interest = wallet.fiatBalance * percentage;
      const previousBalance = wallet.fiatBalance;
      wallet.fiatBalance += interest;

      await wallet.save();

      await Transaction.create({
        userId: wallet.userId,
        type: "INTEREST",
        amount: interest,
        currency: "FIAT",
        status: "SUCCESS",
        meta: { previousBalance },
      });
    } catch (err) {
      console.error(`Failed to apply interest for wallet ${wallet._id}:`, err);
    }
  }

  console.log(`Daily interest applied to ${wallets.length} wallets`);
}
