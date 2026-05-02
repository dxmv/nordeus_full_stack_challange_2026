export type MoveType = "physical" | "magic";

export type EffectKind =
  | "damage"
  | "heal"
  | "drain"
  | "self_damage"
  | "buff_attack"
  | "buff_defense"
  | "buff_magic"
  | "debuff_attack"
  | "debuff_defense"
  | "debuff_magic";

export interface Move {
  id: string;
  name: string;
  type: MoveType;
  effects: EffectKind[];
  baseValue: number;
  description: string;
}

export interface Stats {
  health: number;
  attack: number;
  defense: number;
  magic: number;
}

export interface SpriteCoords {
  sheet: "monsters" | "rogues";
  row: number;
  col: number;
}

export interface Monster {
  id: string;
  name: string;
  stats: Stats;
  moves: Move[];
  sprite: SpriteCoords;
}

export interface RunConfig {
  monsters: Monster[];
}

export interface StatModifier {
  stat: "attack" | "defense" | "magic";
  delta: number;
  turnsLeft: number;
}

export interface BattleState {
  heroCurrentHp: number;
  monsterCurrentHp: number;
  heroModifiers: StatModifier[];
  monsterModifiers: StatModifier[];
  phase: "player_turn" | "monster_turn" | "won" | "lost";
  wonMove: Move | null;
}

export interface MoveResult {
  attackerHpDelta: number;
  defenderHpDelta: number;
  attackerNewModifiers: StatModifier[];
  defenderNewModifiers: StatModifier[];
}

export interface PlayerState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  baseStats: Stats;
  learnedMoves: Move[];
  equippedMoves: Move[];
}
