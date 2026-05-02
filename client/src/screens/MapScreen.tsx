import { useContext } from "react";
import { RunConfigContext } from "../context/RunConfigContext";
import { usePlayer } from "../context/PlayerContext";
import Sprite from "../components/battle/Sprite";
import MoveCard from "../components/battle/MoveCard";
import type { Move } from "../types";

const MAX_EQUIPPED = 4;

interface Props {
  clearedCount: number;
  onFight: (monsterIndex: number) => void;
  onBack: () => void;
}

export default function MapScreen({ clearedCount, onFight, onBack }: Props) {
  const context = useContext(RunConfigContext);
  const { player, equipMove, unequipMove } = usePlayer();
  const monsters = context?.config?.monsters ?? [];

  function isEquipped(move: Move) {
    return player.equippedMoves.some((m) => m.id === move.id);
  }

  function toggleMove(move: Move) {
    if (isEquipped(move)) {
      unequipMove(move.id);
    } else if (player.equippedMoves.length < MAX_EQUIPPED) {
      equipMove(move);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8 gap-10">
      <div className="w-full flex items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-sm tracking-widest uppercase transition-colors"
        >
          ← Menu
        </button>
        <span className="mx-auto text-gray-500 tracking-widest uppercase text-sm">
          Run Overview
        </span>
        <div className="w-16" />
      </div>

      {/* Encounter map */}
      <div className="flex gap-4">
        {monsters.map((monster, i) => {
          const cleared = i < clearedCount;
          const current = i === clearedCount;
          return (
            <div
              key={monster.id}
              className={`flex flex-col items-center gap-3 p-4 bg-gray-800 rounded-xl w-36 border transition-colors ${
                cleared
                  ? "border-green-800"
                  : current
                  ? "border-yellow-600"
                  : "border-gray-700 opacity-40"
              }`}
            >
              <span className="text-gray-500 text-[10px] tracking-widest uppercase">
                #{i + 1}
              </span>
              <Sprite sprite={monster.sprite} scale={2} />
              <span className="text-white text-xs font-bold tracking-wide text-center leading-tight">
                {monster.name}
              </span>
              {cleared ? (
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <span className="text-green-400 text-[10px] font-bold tracking-widest uppercase">
                    Cleared
                  </span>
                  <button
                    onClick={() => onFight(i)}
                    className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-[10px] tracking-widest uppercase rounded transition-colors"
                  >
                    Replay
                  </button>
                </div>
              ) : current ? (
                <button
                  onClick={() => onFight(i)}
                  className="w-full py-1.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-xs tracking-widest uppercase rounded transition-colors"
                >
                  Fight
                </button>
              ) : (
                <span className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Move management */}
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Equipped */}
        <div className="flex flex-col gap-3">
          <span className="text-gray-400 text-xs tracking-widest uppercase">
            Equipped — {player.equippedMoves.length} / {MAX_EQUIPPED}
          </span>
          <div className="grid grid-cols-4 gap-3">
            {player.equippedMoves.map((move) => (
              <div key={move.id} className="flex flex-col gap-1">
                <MoveCard move={move} onSelect={() => {}} disabled />
                <button
                  onClick={() => unequipMove(move.id)}
                  className="w-full py-1 text-[10px] font-bold tracking-widest uppercase text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 rounded transition-colors"
                >
                  Unequip
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Move pool */}
        {player.learnedMoves.some((m) => !isEquipped(m)) && (
          <div className="flex flex-col gap-3">
            <span className="text-gray-400 text-xs tracking-widest uppercase">
              Move Pool
            </span>
            <div className="grid grid-cols-4 gap-3">
              {player.learnedMoves
                .filter((m) => !isEquipped(m))
                .map((move) => (
                  <div key={move.id} className="flex flex-col gap-1">
                    <MoveCard move={move} onSelect={() => {}} disabled />
                    <button
                      onClick={() => toggleMove(move)}
                      disabled={player.equippedMoves.length >= MAX_EQUIPPED}
                      className="w-full py-1 text-[10px] font-bold tracking-widest uppercase text-yellow-400 hover:text-yellow-300 border border-yellow-800 hover:border-yellow-600 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Equip
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
