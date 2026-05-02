import { useEffect, useRef } from "react";
import type { EffectKind, LogEntry } from "../../types";

function formatOutcome(effects: EffectKind[], defenderHpDelta: number, attackerHpDelta: number): string {
  const parts: string[] = [];
  for (const effect of effects) {
    if (effect === "drain")              parts.push(`−${Math.abs(defenderHpDelta)} dmg, +${attackerHpDelta} HP`);
    else if (effect === "damage")        parts.push(`−${Math.abs(defenderHpDelta)} dmg`);
    else if (effect === "heal")          parts.push(`+${attackerHpDelta} HP`);
    else if (effect === "self_damage")   parts.push(`−${Math.abs(attackerHpDelta)} HP (self)`);
    else if (effect === "buff_attack")   parts.push("+ATK");
    else if (effect === "buff_defense")  parts.push("+DEF");
    else if (effect === "buff_magic")    parts.push("+MAG");
    else if (effect === "debuff_attack") parts.push("−ATK");
    else if (effect === "debuff_defense") parts.push("−DEF");
    else if (effect === "debuff_magic")  parts.push("−MAG");
  }
  return parts.join(", ");
}

export default function BattleLog({ entries }: { entries: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  return (
    <div className="w-full max-w-xl h-32 overflow-y-auto flex flex-col gap-1 px-3 py-2 bg-gray-800 border-2 border-gray-700" style={{ boxShadow: "4px 4px 0 #000" }}>
      {entries.length === 0 && (
        <span className="text-gray-600 m-auto" style={{ fontSize: 7 }}>
          no actions yet
        </span>
      )}
      {entries.map((entry) => {
        const isHero = entry.role === "hero";
        const outcome = formatOutcome(entry.effects, entry.defenderHpDelta, entry.attackerHpDelta);
        return (
          <div key={entry.key} className="flex items-baseline gap-2" style={{ fontSize: 7 }}>
            <span className={`w-14 shrink-0 ${isHero ? "text-yellow-400" : "text-red-400"}`}>
              {isHero ? "hero" : "monster"}
            </span>
            <span className="text-white">{entry.moveName}</span>
            {outcome && <span className="text-gray-600">-&gt;</span>}
            {outcome && <span className="text-gray-400">{outcome}</span>}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
