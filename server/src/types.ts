export type MoveType = "physical" | "magic";

export type EffectKind =
  | "damage"
  | "heal"
  | "drain"
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

export interface Monster {
  id: string;
  name: string;
  stats: Stats;
  moves: Move[];
  sprite: string;
}

export interface RunConfig {
  monsters: Monster[];
}
