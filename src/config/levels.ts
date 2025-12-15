export type LevelConfig = {
  dailySpins: number;
  maxFiatReward: number;
  maxPointsReward: number;
  bonusSpinChance: number; // %
  spinCostPoints: number; // cost per extra spin
};

export const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { dailySpins: 3, maxFiatReward: 5, maxPointsReward: 20, bonusSpinChance: 2, spinCostPoints: 100 },
  2: { dailySpins: 5, maxFiatReward: 10, maxPointsReward: 50, bonusSpinChance: 4, spinCostPoints: 80 },
  3: { dailySpins: 7, maxFiatReward: 20, maxPointsReward: 100, bonusSpinChance: 6, spinCostPoints: 60 },
  4: { dailySpins: 9, maxFiatReward: 50, maxPointsReward: 200, bonusSpinChance: 8, spinCostPoints: 50 },
  5: { dailySpins: 12, maxFiatReward: 100, maxPointsReward: 500, bonusSpinChance: 10, spinCostPoints: 40 },
  6: { dailySpins: 15, maxFiatReward: 200, maxPointsReward: 1000, bonusSpinChance: 12, spinCostPoints: 30 },
};
