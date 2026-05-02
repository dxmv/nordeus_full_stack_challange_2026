"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monsters_1 = require("../data/monsters");
const router = (0, express_1.Router)();
function scoreMove(move, hpPct, monsterModifiers) {
    let weight = 10;
    const hasHeal = move.effects.some((e) => e === "heal" || e === "drain");
    const hasDmg = move.effects.some((e) => e === "damage" || e === "drain");
    const hasBuff = move.effects.some((e) => e.startsWith("buff_"));
    const hasDebuff = move.effects.some((e) => e.startsWith("debuff_"));
    if (hasHeal) {
        if (hpPct < 0.3)
            weight += 30;
        else if (hpPct < 0.5)
            weight += 15;
        else if (hpPct < 0.7)
            weight += 5;
        else
            weight -= 5;
    }
    if (hasDmg)
        weight += 5;
    if (hasBuff) {
        const buffedStat = move.effects
            .find((e) => e.startsWith("buff_"))
            ?.replace("buff_", "");
        const alreadyActive = buffedStat !== undefined &&
            monsterModifiers.some((m) => m.stat === buffedStat && m.turnsLeft > 0);
        weight += alreadyActive ? -15 : 8;
    }
    if (hasDebuff)
        weight += 8;
    return Math.max(weight, 1);
}
function weightedRandom(moves, weights) {
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < moves.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return moves[i];
    }
    return moves[moves.length - 1];
}
// GET /api/monster-move?monsterId=&monsterCurrentHp=&heroCurrentHp=&monsterModifiers=[]
router.get("/", (req, res) => {
    const { monsterId, monsterCurrentHp, heroCurrentHp, monsterModifiers } = req.query;
    const monster = monsters_1.MONSTERS.find((m) => m.id === monsterId);
    if (!monster) {
        res.status(400).json({ error: "Unknown monsterId" });
        return;
    }
    const currentHp = Number(monsterCurrentHp);
    if (isNaN(currentHp) || isNaN(Number(heroCurrentHp))) {
        res.status(400).json({ error: "monsterCurrentHp and heroCurrentHp must be numbers" });
        return;
    }
    let modifiers = [];
    try {
        modifiers = monsterModifiers ? JSON.parse(monsterModifiers) : [];
    }
    catch {
        res.status(400).json({ error: "monsterModifiers must be a valid JSON array" });
        return;
    }
    const hpPct = currentHp / monster.stats.health;
    const weights = monster.moves.map((move) => scoreMove(move, hpPct, modifiers));
    const move = weightedRandom(monster.moves, weights);
    res.json({ move });
});
exports.default = router;
