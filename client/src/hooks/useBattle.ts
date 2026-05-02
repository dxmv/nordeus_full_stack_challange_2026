import { useRef, useState } from "react";
import type { BattleState, LogEntry, Monster, Move, MoveResult, StatModifier, Stats } from "../types";

export type LastAction = { role: "hero" | "monster"; move: Move; key: number } | null;

function applyModifiers(base: Stats, modifiers: StatModifier[]): Stats {
  const result = { ...base };
  for (const mod of modifiers) {
    result[mod.stat] += mod.delta;
  }
  return result;
}

function tickModifiers(modifiers: StatModifier[]): StatModifier[] {
  return modifiers
    .map((m) => ({ ...m, turnsLeft: m.turnsLeft - 1 }))
    .filter((m) => m.turnsLeft > 0);
}

function resolveMove(
  move: Move,
  attackerStats: Stats,
  defenderStats: Stats
): MoveResult {
  let attackerHpDelta = 0;
  let defenderHpDelta = 0;
  const attackerNewModifiers: StatModifier[] = [];
  const defenderNewModifiers: StatModifier[] = [];

  for (const effect of move.effects) {
    if (effect === "damage") {
      const dmg =
        move.type === "physical"
          ? Math.max(0, attackerStats.attack + move.baseValue - defenderStats.defense)
          : attackerStats.magic + move.baseValue;
      defenderHpDelta -= dmg;
    } else if (effect === "heal") {
      attackerHpDelta += attackerStats.magic + move.baseValue;
    } else if (effect === "self_damage") {
      attackerHpDelta -= move.baseValue;
    } else if (effect === "drain") {
      const dmg =
        move.type === "physical"
          ? Math.max(0, attackerStats.attack + move.baseValue - defenderStats.defense)
          : attackerStats.magic + move.baseValue;
      defenderHpDelta -= dmg;
      attackerHpDelta += dmg;
    } else if (effect.startsWith("buff_")) {
      const stat = effect.replace("buff_", "") as "attack" | "defense" | "magic";
      attackerNewModifiers.push({ stat, delta: move.baseValue, turnsLeft: 2 });
    } else if (effect.startsWith("debuff_")) {
      const stat = effect.replace("debuff_", "") as "attack" | "defense" | "magic";
      defenderNewModifiers.push({ stat, delta: -move.baseValue, turnsLeft: 2 });
    }
  }

  return { attackerHpDelta, defenderHpDelta, attackerNewModifiers, defenderNewModifiers };
}

function clampHp(hp: number, max: number): number {
  return Math.min(max, Math.max(0, hp));
}

async function fetchMonsterMove(
  monsterId: string,
  monsterCurrentHp: number,
  heroCurrentHp: number,
  monsterModifiers: StatModifier[]
): Promise<Move> {
  const params = new URLSearchParams({
    monsterId,
    monsterCurrentHp: String(monsterCurrentHp),
    heroCurrentHp: String(heroCurrentHp),
    monsterModifiers: JSON.stringify(monsterModifiers),
  });
  const res = await fetch(`http://localhost:3000/api/monster-move?${params}`);
  const data = await res.json();
  return data.move as Move;
}

function initialState(heroStats: Stats, monster: Monster): BattleState {
  return {
    heroCurrentHp: heroStats.health,
    monsterCurrentHp: monster.stats.health,
    heroModifiers: [],
    monsterModifiers: [],
    phase: "player_turn",
    wonMove: null,
  };
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const ANIM_DURATION = 500;

export function useBattle(heroBaseStats: Stats, monster: Monster) {
  const [battle, setBattle] = useState<BattleState>(() =>
    initialState(heroBaseStats, monster)
  );
  const [lastAction, setLastAction] = useState<LastAction>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const battleRef = useRef(battle);
  const actionKeyRef = useRef(0);
  // eslint-disable-next-line react-hooks/refs
  battleRef.current = battle;

  function appendLog(role: "hero" | "monster", move: Move, result: MoveResult) {
    setLog((prev) => [...prev, {
      key: actionKeyRef.current,
      role,
      moveName: move.name,
      effects: move.effects,
      defenderHpDelta: result.defenderHpDelta,
      attackerHpDelta: result.attackerHpDelta,
    }]);
  }

  async function takeTurn(playerMove: Move) {
    const cur = battleRef.current;
    if (cur.phase !== "player_turn") return;

    const heroEff = applyModifiers(heroBaseStats, cur.heroModifiers);
    const monsterEff = applyModifiers(monster.stats, cur.monsterModifiers);

    // Player acts
    setLastAction({ role: "hero", move: playerMove, key: ++actionKeyRef.current });
    const playerResult = resolveMove(playerMove, heroEff, monsterEff);
    const newMonsterHp = clampHp(cur.monsterCurrentHp + playerResult.defenderHpDelta, monster.stats.health);
    const newHeroHp = clampHp(cur.heroCurrentHp + playerResult.attackerHpDelta, heroBaseStats.health);
    const newHeroMods = tickModifiers([...cur.heroModifiers, ...playerResult.attackerNewModifiers]);
    const newMonsterMods = tickModifiers([...cur.monsterModifiers, ...playerResult.defenderNewModifiers]);
    appendLog("hero",playerMove,playerResult);

    if (newMonsterHp <= 0) {
      const wonMove = monster.moves[Math.floor(Math.random() * monster.moves.length)];
      setBattle({ heroCurrentHp: newHeroHp, monsterCurrentHp: 0, heroModifiers: newHeroMods, monsterModifiers: newMonsterMods, phase: "won", wonMove });
      setLastAction(null);
      return;
    }

    setBattle({ heroCurrentHp: newHeroHp, monsterCurrentHp: newMonsterHp, heroModifiers: newHeroMods, monsterModifiers: newMonsterMods, phase: "monster_turn", wonMove: null });

    // Fetch monster move while player animation plays
    const [monsterMove] = await Promise.all([
      fetchMonsterMove(monster.id, newMonsterHp, newHeroHp, newMonsterMods),
      delay(ANIM_DURATION),
    ]);

    const monsterEff2 = applyModifiers(monster.stats, newMonsterMods);
    const heroEff2 = applyModifiers(heroBaseStats, newHeroMods);
    const monsterResult = resolveMove(monsterMove, monsterEff2, heroEff2);

    const finalHeroHp = clampHp(newHeroHp + monsterResult.defenderHpDelta, heroBaseStats.health);
    const finalMonsterHp = clampHp(newMonsterHp + monsterResult.attackerHpDelta, monster.stats.health);
    const finalHeroMods = tickModifiers([...newHeroMods, ...monsterResult.defenderNewModifiers]);
    const finalMonsterMods = tickModifiers([...newMonsterMods, ...monsterResult.attackerNewModifiers]);

    // Monster acts
    setLastAction({ role: "monster", move: monsterMove, key: ++actionKeyRef.current });
    appendLog("hero",monsterMove,monsterResult);


    if (finalHeroHp <= 0) {
      setBattle({ heroCurrentHp: 0, monsterCurrentHp: finalMonsterHp, heroModifiers: finalHeroMods, monsterModifiers: finalMonsterMods, phase: "lost", wonMove: null });
      await delay(ANIM_DURATION);
      setLastAction(null);
      return;
    }

    setBattle({ heroCurrentHp: finalHeroHp, monsterCurrentHp: finalMonsterHp, heroModifiers: finalHeroMods, monsterModifiers: finalMonsterMods, phase: "monster_turn", wonMove: null });
    await delay(ANIM_DURATION);
    setLastAction(null);
    setBattle({ heroCurrentHp: finalHeroHp, monsterCurrentHp: finalMonsterHp, heroModifiers: finalHeroMods, monsterModifiers: finalMonsterMods, phase: "player_turn", wonMove: null });
  }

  function reset() {
    setLastAction(null);
    setBattle(initialState(heroBaseStats, monster));
  }

  return { battle, lastAction, takeTurn, reset };
}
