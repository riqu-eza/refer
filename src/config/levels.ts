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
  },
  silver: {
    level: 2,
    price: 249,
  },
  gold: {
    level: 3,
    price: 499,
  },
  platinum: {
    level: 4,
    price: 999,
  },
} as const;

export type LevelId = keyof typeof LEVEL_CONFIG;
