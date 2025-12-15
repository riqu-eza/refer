export async function buyExtraSpin(userId: string) {
  const user = await User.findById(userId);
  const wallet = await Wallet.findOne({ userId });
  const spinState = await UserSpinState.findOne({ userId });

  const cost = LEVEL_CONFIG[user.level].spinCostPoints;
  if (wallet.pointsBalance < cost) throw new Error("Insufficient points");

  wallet.pointsBalance -= cost;
  spinState.extraSpins += 1;

  await Transaction.create({
    userId,
    type: "BUY_SPIN",
    amount: cost,
    currency: "POINTS",
    status: "SUCCESS",
  });

  await wallet.save();
  await spinState.save();
}
