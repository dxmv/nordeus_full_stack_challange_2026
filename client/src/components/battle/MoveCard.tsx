import { useState } from "react";
import type { Move } from "../../types";

const TYPE_COLOR = {
  physical: { hex: "#f97316", shadow: "rgba(249,115,22,0.8)" },
  magic:    { hex: "#a855f7", shadow: "rgba(168,85,247,0.8)" },
};

interface Props {
  move: Move;
  onSelect: (move: Move) => void;
  disabled?: boolean;
}

export default function MoveCard({ move, onSelect, disabled }: Props) {
  const [hovered, setHovered] = useState(false);
  const { hex, shadow } = TYPE_COLOR[move.type];
  const active = hovered && !disabled;

  return (
    <button
      onClick={() => onSelect(move)}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col gap-2 px-3 pt-3 pb-3 bg-gray-800 border-2 text-left w-full h-full cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        borderColor: active ? hex : "#374151",
        boxShadow: active ? `4px 4px 0 ${shadow}` : "4px 4px 0 #000",
        transform: active ? "translate(-1px, -1px)" : undefined,
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: hex }} />

      {/* Type label */}
      <span className="mt-1" style={{ fontSize: 7, color: hex }}>
        {move.type}
      </span>

      {/* Move name */}
      <span className="text-white leading-relaxed" style={{ fontSize: 9 }}>
        {move.name}
      </span>

      {/* Effects */}
      <div className="flex flex-wrap gap-1">
        {move.effects.map((e) => (
          <span
            key={e}
            className="px-1 py-px border border-gray-600 bg-gray-700 text-gray-300"
            style={{ fontSize: 6 }}
          >
            {e.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-400 leading-relaxed flex-1" style={{ fontSize: 7 }}>
        {move.description}
      </p>

      {/* Base value */}
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="font-bold tabular-nums" style={{ fontSize: 8, color: hex }}>
          {move.baseValue}
        </span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
    </button>
  );
}
