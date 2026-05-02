import { Router, Request, Response } from "express";
import { MONSTERS } from "../data/monsters";
import type { Move, StatModifier } from "../types";

const router = Router();

function scoreMove(
  move: Move,
  hpPct: number,
  monsterModifiers: StatModifier[]
): number {
  let weight = 10;

  const hasHeal = move.effects.some((e) => e === "heal" || e === "drain");
  const hasDmg = move.effects.some((e) => e === "damage" || e === "drain");
  const hasBuff = move.effects.some((e) => e.startsWith("buff_"));
  const hasDebuff = move.effects.some((e) => e.startsWith("debuff_"));

  if (hasHeal) {
    if (hpPct < 0.3) weight += 30;
    else if (hpPct < 0.5) weight += 15;
    else if (hpPct < 0.7) weight += 5;
    else weight -= 5;
  }

  if (hasDmg) weight += 5;

  if (hasBuff) {
    const buffedStat = move.effects
      .find((e) => e.startsWith("buff_"))
      ?.replace("buff_", "") as "attack" | "defense" | "magic" | undefined;
    const alreadyActive =
      buffedStat !== undefined &&
      monsterModifiers.some((m) => m.stat === buffedStat && m.turnsLeft > 0);
    weight += alreadyActive ? -15 : 8;
  }

  if (hasDebuff) weight += 8;

  return Math.max(weight, 1);
}

function weightedRandom(moves: Move[], weights: number[]): Move {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < moves.length; i++) {
    r -= weights[i];
    if (r <= 0) return moves[i];
  }
  return moves[moves.length - 1];
}

// GET /api/monster-move?monsterId=&monsterCurrentHp=&heroCurrentHp=&monsterModifiers=[]
router.get("/", (req: Request, res: Response) => {
  const { monsterId, monsterCurrentHp, heroCurrentHp, monsterModifiers } =
    req.query;

  const monster = MONSTERS.find((m) => m.id === monsterId);
  if (!monster) {
    res.status(400).json({ error: "Unknown monsterId" });
    return;
  }

  const currentHp = Number(monsterCurrentHp);
  if (isNaN(currentHp) || isNaN(Number(heroCurrentHp))) {
    res.status(400).json({ error: "monsterCurrentHp and heroCurrentHp must be numbers" });
    return;
  }

  let modifiers: StatModifier[] = [];
  try {
    modifiers = monsterModifiers ? JSON.parse(monsterModifiers as string) : [];
  } catch {
    res.status(400).json({ error: "monsterModifiers must be a valid JSON array" });
    return;
  }

  const hpPct = currentHp / monster.stats.health;
  const weights = monster.moves.map((move) => scoreMove(move, hpPct, modifiers));
  const move = weightedRandom(monster.moves, weights);

  res.json({ move });
});

export default router;
