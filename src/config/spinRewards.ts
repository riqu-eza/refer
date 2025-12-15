export type SpinReward = {
  key: string;
  type: "POINTS" | "FIAT" | "SPIN" | "NONE";
  value: number;
  weight: number;
};

export const SPIN_REWARDS: SpinReward[] = [
  { key: "PTS_10", type: "POINTS", value: 10, weight: 25 },
  { key: "PTS_20", type: "POINTS", value: 20, weight: 20 },
  { key: "PTS_50", type: "POINTS", value: 50, weight: 15 },
  { key: "KES_5", type: "FIAT", value: 5, weight: 10 },
  { key: "KES_10", type: "FIAT", value: 10, weight: 6 },
  { key: "BONUS_SPIN", type: "SPIN", value: 1, weight: 6 },
  { key: "TRY_AGAIN", type: "NONE", value: 0, weight: 13 },
  { key: "RARE", type: "FIAT", value: 100, weight: 5 },
];
