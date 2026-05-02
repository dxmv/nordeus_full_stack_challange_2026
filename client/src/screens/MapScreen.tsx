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
  onSaveAndExit: () => void;
}

export default function MapScreen({ clearedCount, onFight, onBack, onSaveAndExit }: Props) {
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
        <button
          onClick={onSaveAndExit}
          className="btn-pixel px-2 py-1 bg-gray-700 text-gray-300 border-2 border-gray-600"
          style={{ fontSize: 7 }}
        >
          save &amp; exit
        </button>
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

      {/* Hero stats */}
      <div className="w-full max-w-3xl pixel-panel bg-gray-800 p-4 flex items-center gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-yellow-400 font-bold" style={{ fontSize: 9 }}>hero</span>
          <span className="text-gray-400" style={{ fontSize: 7 }}>lv. {player.level}</span>
        </div>
        {/* XP bar */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex justify-between" style={{ fontSize: 7 }}>
            <span className="text-gray-500">xp</span>
            <span className="text-gray-500">{player.xp} / {player.xpToNextLevel}</span>
          </div>
          <div className="w-full h-2 bg-gray-700 border border-gray-600">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (player.xp / player.xpToNextLevel) * 100)}%` }}
            />
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1" style={{ fontSize: 7 }}>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">HP</span>
            <span className="text-white">{player.baseStats.health}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">ATK</span>
            <span className="text-orange-400">{player.baseStats.attack}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">DEF</span>
            <span className="text-blue-400">{player.baseStats.defense}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">MAG</span>
            <span className="text-purple-400">{player.baseStats.magic}</span>
          </div>
        </div>
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
