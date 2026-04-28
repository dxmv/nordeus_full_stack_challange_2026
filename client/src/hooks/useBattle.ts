import { useState } from "react";
import type { BattleState, Monster, Stats } from "../types";

function initialState(heroStats: Stats, monster: Monster): BattleState {
  return {
    heroCurrentHp: heroStats.health,
    monsterCurrentHp: monster.stats.health,
    heroModifiers: [],
    monsterModifiers: [],
    phase: "player_turn",
  };
}

export function useBattle(heroStats: Stats, monster: Monster) {
  const [battle, setBattle] = useState<BattleState>(() =>
    initialState(heroStats, monster)
  );

  function reset() {
    setBattle(initialState(heroStats, monster));
  }

  return { battle, setBattle, reset };
}
