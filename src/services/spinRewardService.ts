import { SPIN_REWARDS } from "@/src/config/spinRewards";
import { LEVEL_CONFIG } from "@/src/config/levels";

type RewardType = "FIAT" | "POINTS" | string;

interface Reward {
  type: RewardType;
  value: number;
  weight: number;
  [key: string]: unknown;
}

export function getAllowedRewards(level: number): Reward[] {
  const cfg = LEVEL_CONFIG[level];

  const allowed = SPIN_REWARDS.filter(r => {
    if (r.type === "FIAT" && r.value > cfg.maxFiatReward) return false;
    if (r.type === "POINTS" && r.value > cfg.maxPointsReward) return false;
    return true;
  });

  return normalizeWeights(allowed);
}

function normalizeWeights(rewards: Reward[]): Reward[] {
  const total = rewards.reduce((s, r) => s + r.weight, 0);
  return rewards.map(r => ({
    ...r,
    weight: (r.weight / total) * 100,
  }));
}

export function rollReward(rewards: Reward[]): Reward {
  const roll = Math.random() * 100;
  let acc = 0;

  for (const r of rewards) {
    acc += r.weight;
    if (roll <= acc) return r;
  }

  return rewards[rewards.length - 1];
}

