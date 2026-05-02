import { useContext, useEffect } from "react";
import Combatant from "../components/battle/Combatant";
import MoveSelection from "../components/battle/MoveSelection";
import { RunConfigContext } from "../context/RunConfigContext";
import { usePlayer } from "../context/PlayerContext";
import { useBattle } from "../hooks/useBattle";
import { HERO_SPRITE } from "../data/sprites";

interface Props {
  monsterIndex: number;
  onWin: () => void;
  onBack: () => void;
}

export default function BattleScreen({ monsterIndex, onWin, onBack }: Props) {
  const context = useContext(RunConfigContext);
  const { player, gainXp, learnMove } = usePlayer();
  const monster = context?.config?.monsters[monsterIndex];

  if (!monster) return null;

  const { battle, takeTurn, reset } = useBattle(player.baseStats, monster);

  useEffect(() => {
    if (battle.phase === "won" && battle.wonMove) {
      learnMove(battle.wonMove);
      gainXp(100);
    }
  }, [battle.phase]);

  const heroHp = { current: battle.heroCurrentHp, max: player.baseStats.health };
  const monsterHp = { current: battle.monsterCurrentHp, max: monster.stats.health };
  const isOver = battle.phase === "won" || battle.phase === "lost";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-between p-8">
      <div className="w-full flex items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
        >
          ← Back
        </button>
        <span className="mx-auto text-gray-500 tracking-widest uppercase text-sm">
          Battle
        </span>
        <div className="w-12" />
      </div>

      <div className="relative flex items-center justify-center gap-24">
        <Combatant label="Hero" hp={heroHp} sprite={HERO_SPRITE} />
        <span className="text-gray-600 text-2xl font-bold">VS</span>
        <Combatant label={monster.name} hp={monsterHp} sprite={monster.sprite} />

        {isOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 rounded-xl gap-4">
            <span className="text-3xl font-bold tracking-widest uppercase text-white">
              {battle.phase === "won" ? "Victory!" : "Defeated"}
            </span>
            {battle.wonMove && (
              <span className="text-yellow-400 text-sm tracking-widest uppercase">
                Learned: {battle.wonMove.name}!
              </span>
            )}
            {battle.phase === "won" ? (
              <button
                onClick={onWin}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold tracking-widest uppercase text-sm rounded transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold tracking-widest uppercase text-sm rounded transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>

      <MoveSelection
        moves={player.equippedMoves}
        onSelect={(move) => takeTurn(move)}
        disabled={battle.phase !== "player_turn"}
      />
    </div>
  );
}