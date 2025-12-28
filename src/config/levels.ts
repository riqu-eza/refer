export type LevelConfig = {
  dailySpins: number;
  maxFiatReward: number;
  maxPointsReward: number;
  bonusSpinChance: number; // %
  spinCostPoints: number; // cost per extra spin
};

export const LEVEL_CONFIG = {
  bronze: {
    level: 1,
    price: 99,
    dailySpins: 3,
    spinCostPoints: 500,
  },
  silver: {
    level: 2,
    price: 249,
    dailySpins: 5,
    spinCostPoints: 400,
  },
  gold: {
    level: 3,
    price: 499,
    dailySpins: 7,
    spinCostPoints: 300,
  },
  platinum: {
    level: 4,
    price: 999,
    dailySpins: 10,
    spinCostPoints: 200,
  },
} as const;


export type LevelId = keyof typeof LEVEL_CONFIG;
