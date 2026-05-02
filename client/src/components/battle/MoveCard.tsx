import { useState } from "react";
import type { Move } from "../../types";

const TYPE_COLOR = {
  physical: { hex: "#f97316", glow: "rgba(249,115,22,0.5)" },
  magic:    { hex: "#a855f7", glow: "rgba(168,85,247,0.5)" },
};

interface Props {
  move: Move;
  onSelect: (move: Move) => void;
  disabled?: boolean;
}

export default function MoveCard({ move, onSelect, disabled }: Props) {
  const [hovered, setHovered] = useState(false);
  const { hex, glow } = TYPE_COLOR[move.type];
  const active = hovered && !disabled;

  return (
    <button
      onClick={() => onSelect(move)}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden flex flex-col gap-2 px-4 pt-3 pb-4 bg-gray-800 border border-gray-700 rounded-xl text-left w-full cursor-pointer
        transition-all duration-200 ease-out
        active:scale-95 active:translate-y-0
        disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        transform: active ? "translateY(-14px) scale(1.06)" : undefined,
        borderColor: active ? hex : undefined,
        boxShadow: active
          ? `0 0 20px ${glow}, 0 14px 40px rgba(0,0,0,0.7)`
          : "0 2px 12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Shimmer sweep */}
      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-500"
        style={{
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 50%, transparent 65%)",
          transform: active ? "translateX(200%)" : "translateX(-200%)",
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: hex }} />

      {/* Type label */}
      <span className="text-[10px] font-bold tracking-[0.15em] uppercase mt-1" style={{ color: hex }}>
        {move.type}
      </span>

      {/* Move name */}
      <span className="text-white font-bold text-sm leading-tight">{move.name}</span>

      {/* Effects */}
      <div className="flex flex-wrap gap-1">
        {move.effects.map((e) => (
          <span
            key={e}
            className="text-[9px] px-1.5 py-0.5 rounded-full border border-gray-600 bg-gray-700/60 text-gray-300 tracking-wide"
          >
            {e.replace(/_/g, " ")}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-[10px] leading-relaxed flex-1">{move.description}</p>

      {/* Base value rule */}
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-px bg-gray-700" />
        <span className="text-[11px] font-bold tabular-nums" style={{ color: hex }}>
          {move.baseValue}
        </span>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
    </button>
  );
}
