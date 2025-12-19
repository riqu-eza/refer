// src/config/spinConfig.ts
export const LEVEL_SPINS: Record<number, number> = {
  1: 3,
  2: 5,
  3: 7,
  4: 10,
};

export const DAILY_POINT_CAP = 333;

export const WHEEL_BUCKETS = [
  { label: "NO_WIN", min: 0, max: 0, weight: 30 },
  { label: "SMALL", min: 5, max: 15, weight: 40 },
  { label: "MEDIUM", min: 20, max: 40, weight: 20 },
  { label: "BONUS", min: 50, max: 80, weight: 7 },
  { label: "BIG", min: 100, max: 150, weight: 3 },
];
