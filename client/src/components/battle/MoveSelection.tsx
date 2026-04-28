import type { Move } from "../../types";

interface Props {
  moves: Move[];
  onSelect: (move: Move) => void;
  disabled?: boolean;
}

export default function MoveSelection({ moves, onSelect, disabled }: Props) {
  return (
    <div className="w-full max-w-lg grid grid-cols-2 gap-3">
      {moves.map((move) => (
        <button
          key={move.id}
          onClick={() => onSelect(move)}
          disabled={disabled}
          className="flex flex-col items-start gap-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700 hover:border-gray-500 rounded-xl transition-all duration-150"
        >
          <span className="text-white font-semibold text-sm">{move.name}</span>
          <span className={`text-xs font-medium tracking-wide ${move.type === "physical" ? "text-orange-400" : "text-purple-400"}`}>
            {move.type}
          </span>
        </button>
      ))}
    </div>
  );
}
