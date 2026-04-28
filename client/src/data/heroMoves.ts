import type { Move } from "../types";

export const HERO_DEFAULT_MOVES: Move[] = [
  {
    id: "slash",
    name: "Slash",
    type: "physical",
    effects: ["damage"],
    baseValue: 14,
    description: "Physical. Deals moderate damage. Scales off Attack, reduced by target's Defense.",
  },
  {
    id: "shield_up",
    name: "Shield Up",
    type: "physical",
    effects: ["buff_defense"],
    baseValue: 4,
    description: "No damage. Raises the knight's Defense for two turns.",
  },
  {
    id: "battle_cry",
    name: "Battle Cry",
    type: "physical",
    effects: ["buff_attack"],
    baseValue: 4,
    description: "No damage. Raises the knight's Attack for two turns.",
  },
  {
    id: "second_wind",
    name: "Second Wind",
    type: "magic",
    effects: ["heal"],
    baseValue: 18,
    description: "Heals the knight for a moderate amount. Scales off Magic.",
  },
];
