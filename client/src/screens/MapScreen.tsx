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
    <div className="min-h-screen flex flex-col items-center p-8 gap-10">
      <div className="w-full flex items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
          style={{ fontSize: 8 }}
        >
          &lt; menu
        </button>
        <span className="mx-auto text-gray-500" style={{ fontSize: 8 }}>
          run overview
        </span>
        <div className="w-16" />
      </div>

      {/* Encounter map */}
      <div className="flex gap-3">
        {monsters.map((monster, i) => {
          const cleared = i < clearedCount;
          const current = i === clearedCount;
          return (
            <div
              key={monster.id}
              className={`flex flex-col items-center gap-3 p-3 bg-gray-800 w-32 border-2 ${
                cleared
                  ? "border-green-700"
                  : current
                  ? "border-yellow-500"
                  : "border-gray-700 opacity-40"
              }`}
              style={{ boxShadow: "4px 4px 0 #000" }}
            >
              <span className="text-gray-500" style={{ fontSize: 7 }}>
                #{i + 1}
              </span>
              <Sprite sprite={monster.sprite} scale={2} />
              <span className="text-white text-center leading-relaxed" style={{ fontSize: 7 }}>
                {monster.name}
              </span>
              {cleared ? (
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <span className="text-green-400" style={{ fontSize: 7 }}>
                    cleared
                  </span>
                  <button
                    onClick={() => onFight(i)}
                    className="btn-pixel w-full py-1.5 bg-gray-700 text-gray-300 border-2 border-gray-600"
                    style={{ fontSize: 7 }}
                  >
                    replay
                  </button>
                </div>
              ) : current ? (
                <button
                  onClick={() => onFight(i)}
                  className="btn-pixel w-full py-1.5 bg-yellow-500 text-gray-900 font-bold border-2 border-yellow-700"
                  style={{ fontSize: 7 }}
                >
                  fight
                </button>
              ) : (
                <span className="text-gray-600" style={{ fontSize: 7 }}>
                  locked
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
          <span className="text-gray-400" style={{ fontSize: 8 }}>
            equipped — {player.equippedMoves.length} / {MAX_EQUIPPED}
          </span>
          <div className="grid grid-cols-4 gap-3">
            {player.equippedMoves.map((move) => (
              <div key={move.id} className="flex flex-col gap-1">
                <MoveCard move={move} onSelect={() => {}} disabled />
                <button
                  onClick={() => unequipMove(move.id)}
                  className="btn-pixel w-full py-1 text-red-400 border-2 border-red-900 bg-gray-800"
                  style={{ fontSize: 7 }}
                >
                  unequip
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Move pool */}
        {player.learnedMoves.some((m) => !isEquipped(m)) && (
          <div className="flex flex-col gap-3">
            <span className="text-gray-400" style={{ fontSize: 8 }}>
              move pool
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
                      className="btn-pixel w-full py-1 text-yellow-400 border-2 border-yellow-900 bg-gray-800 disabled:opacity-40"
                      style={{ fontSize: 7 }}
                    >
                      equip
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
