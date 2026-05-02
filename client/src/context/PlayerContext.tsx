import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Move, PlayerState, Stats } from "../types";
import { HERO_DEFAULT_MOVES } from "../data/heroMoves";

const BASE_STATS_LEVEL_1: Stats = { health: 100, attack: 10, defense: 8, magic: 8 };
const STAT_GAINS_PER_LEVEL: Stats = { health: 15, attack: 3, defense: 2, magic: 2 };
const XP_PER_LEVEL = (level: number) => level * 100;

function buildStats(level: number): Stats {
  return {
    health:  BASE_STATS_LEVEL_1.health  + STAT_GAINS_PER_LEVEL.health  * (level - 1),
    attack:  BASE_STATS_LEVEL_1.attack  + STAT_GAINS_PER_LEVEL.attack  * (level - 1),
    defense: BASE_STATS_LEVEL_1.defense + STAT_GAINS_PER_LEVEL.defense * (level - 1),
    magic:   BASE_STATS_LEVEL_1.magic   + STAT_GAINS_PER_LEVEL.magic   * (level - 1),
  };
}

const INITIAL_STATE: PlayerState = {
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL(1),
  baseStats: buildStats(1),
  learnedMoves: [...HERO_DEFAULT_MOVES],
  equippedMoves: [...HERO_DEFAULT_MOVES],
};

interface LevelUpInfo {
  level: number;
  stats: Stats;
}

interface PlayerContextValue {
  player: PlayerState;
  pendingLevelUp: LevelUpInfo | null;
  dismissLevelUp: () => void;
  gainXp: (amount: number) => void;
  learnMove: (move: Move) => void;
  equipMove: (move: Move) => void;
  unequipMove: (moveId: string) => void;
  restorePlayer: (state: PlayerState) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(INITIAL_STATE);
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpInfo | null>(null);

  function gainXp(amount: number) {
    setPlayer((prev) => {
      let { xp, level, xpToNextLevel, baseStats } = prev;
      xp += amount;
      let didLevelUp = false;
      while (xp >= xpToNextLevel) {
        xp -= xpToNextLevel;
        level += 1;
        xpToNextLevel = XP_PER_LEVEL(level);
        baseStats = buildStats(level);
        didLevelUp = true;
      }
      if (didLevelUp) {
        setPendingLevelUp({ level, stats: baseStats });
      }
      return { ...prev, xp, level, xpToNextLevel, baseStats };
    });
  }

  function dismissLevelUp() {
    setPendingLevelUp(null);
  }

  function learnMove(move: Move) {
    setPlayer((prev) => {
      const alreadyKnown = prev.learnedMoves.some((m) => m.id === move.id);
      if (alreadyKnown) return prev;
      return { ...prev, learnedMoves: [...prev.learnedMoves, move] };
    });
  }

  function equipMove(move: Move) {
    setPlayer((prev) => {
      if (prev.equippedMoves.some((m) => m.id === move.id)) return prev;
      return { ...prev, equippedMoves: [...prev.equippedMoves, move] };
    });
  }

  function unequipMove(moveId: string) {
    setPlayer((prev) => ({
      ...prev,
      equippedMoves: prev.equippedMoves.filter((m) => m.id !== moveId),
    }));
  }

  function restorePlayer(state: PlayerState) {
    setPlayer(state);
  }

  return (
    <PlayerContext.Provider value={{ player, pendingLevelUp, dismissLevelUp, gainXp, learnMove, equipMove, unequipMove, restorePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
