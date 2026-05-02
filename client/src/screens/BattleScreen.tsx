import { useContext, useEffect } from "react";
import BattleLog from "../components/battle/BattleLog";
import Combatant from "../components/battle/Combatant";
import MoveSelection from "../components/battle/MoveSelection";
import { RunConfigContext } from "../context/RunConfigContext";
import { usePlayer } from "../context/PlayerContext";
import { useBattle, type LastAction } from "../hooks/useBattle";
import { HERO_SPRITE } from "../data/sprites";
import type { AnimKind } from "../components/battle/MoveAnimation";
import type { EffectKind, MoveType } from "../types";

interface Props {
  monsterIndex: number;
  onWin: () => void;
  onBack: () => void;
}

function pickAnim(effects: EffectKind[], moveType: MoveType, side: "attacker" | "defender"): AnimKind | null {
  if (side === "attacker") {
    if (effects.includes("drain")) return "heal";
    if (effects.includes("heal")) return "heal";
    if (effects.some((e) => e.startsWith("buff_"))) return "buff";
    return null;
  } else {
    if (effects.includes("drain")) return "drain";
    if (effects.includes("damage")) return moveType === "physical" ? "slash" : "magic";
    if (effects.some((e) => e.startsWith("debuff_"))) return "debuff";
    return null;
  }
}

function deriveAnims(lastAction: LastAction): { heroAnim: AnimKind | null; monsterAnim: AnimKind | null } {
  if (!lastAction) return { heroAnim: null, monsterAnim: null };
  const { role, move } = lastAction;
  const attackerAnim = pickAnim(move.effects, move.type, "attacker");
  const defenderAnim = pickAnim(move.effects, move.type, "defender");
  return role === "hero"
    ? { heroAnim: attackerAnim, monsterAnim: defenderAnim }
    : { heroAnim: defenderAnim, monsterAnim: attackerAnim };
}

export default function BattleScreen({ monsterIndex, onWin, onBack }: Props) {
  const context = useContext(RunConfigContext);
  const { player, gainXp, learnMove, pendingLevelUp, dismissLevelUp } = usePlayer();
  const monster = context?.config?.monsters[monsterIndex];

  const { battle, lastAction, log, takeTurn, reset } = useBattle(player.baseStats, monster!);

  useEffect(() => {
    if (battle.phase === "won" && battle.wonMove) {
      learnMove(battle.wonMove);
      gainXp(100);
    }
  }, [battle.phase]);

  if (!monster) return null;

  const { heroAnim, monsterAnim } = deriveAnims(lastAction);
  const animKey = lastAction?.key ?? 0;

  const heroHp = { current: battle.heroCurrentHp, max: player.baseStats.health };
  const monsterHp = { current: battle.monsterCurrentHp, max: monster.stats.health };
  const isOver = battle.phase === "won" || battle.phase === "lost";

  return (
    <div className="min-h-screen flex flex-col items-center p-8 gap-8">
      {/* Header */}
      <div className="w-full flex items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
          style={{ fontSize: 8 }}
        >
          &lt; back
        </button>
        <span className="mx-auto text-gray-500" style={{ fontSize: 8 }}>
          battle
        </span>
        <div className="w-12" />
      </div>

      {/* Combatants */}
      <div className="flex items-center justify-center gap-24 flex-1">
        <Combatant label="hero" hp={heroHp} sprite={HERO_SPRITE} flip anim={heroAnim} animKey={animKey} />
        <span className="text-gray-600 font-bold" style={{ fontSize: 10 }}>vs</span>
        <Combatant label={monster.name} hp={monsterHp} sprite={monster.sprite} anim={monsterAnim} animKey={animKey} />
      </div>

      {/* Move selection */}
      <MoveSelection
        moves={player.equippedMoves}
        onSelect={(move) => takeTurn(move)}
        disabled={battle.phase !== "player_turn"}
      />

      {/* Battle log — fixed upper right */}
      <div className="fixed top-16 right-4 w-64 z-10">
        <BattleLog entries={log} />
      </div>

      {/* Level-up overlay — shown on top of everything, dismissed before continuing */}
      {pendingLevelUp && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-6"
          style={{ background: "rgba(13,13,26,0.97)" }}>
          <span className="text-yellow-400 text-xl leading-relaxed">level up!</span>
          <span className="text-white leading-relaxed" style={{ fontSize: 10 }}>
            level {pendingLevelUp.level}
          </span>
          <div className="flex flex-col gap-2 pixel-panel bg-gray-800 px-8 py-4">
            {(["health", "attack", "defense", "magic"] as const).map((stat) => (
              <div key={stat} className="flex justify-between gap-8" style={{ fontSize: 8 }}>
                <span className="text-gray-400 uppercase">{stat}</span>
                <span className="text-green-400">{pendingLevelUp.stats[stat]}</span>
              </div>
            ))}
          </div>
          <button
            onClick={dismissLevelUp}
            className="btn-pixel px-8 py-3 bg-yellow-500 text-gray-900 font-bold border-2 border-yellow-700"
            style={{ fontSize: 8 }}
          >
            ok
          </button>
        </div>
      )}

      {/* Victory / defeat overlay — full screen */}
      {isOver && !pendingLevelUp && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-8"
          style={{ background: "rgba(13,13,26,0.96)" }}>
          <span className="text-white text-xl leading-relaxed">
            {battle.phase === "won" ? "victory!" : "defeated"}
          </span>
          {battle.wonMove && (
            <span className="text-yellow-400 text-center leading-loose" style={{ fontSize: 8 }}>
              learned:<br />{battle.wonMove.name}!
            </span>
          )}
          {battle.phase === "won" ? (
            <button
              onClick={onWin}
              className="btn-pixel px-8 py-3 bg-yellow-500 text-gray-900 font-bold border-2 border-yellow-700"
              style={{ fontSize: 8 }}
            >
              continue
            </button>
          ) : (
            <button
              onClick={reset}
              className="btn-pixel px-8 py-3 bg-gray-700 text-white font-bold border-2 border-gray-500"
              style={{ fontSize: 8 }}
            >
              try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
