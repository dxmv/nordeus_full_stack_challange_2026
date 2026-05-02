const SEGMENTS = 20;

interface Props {
  current: number;
  max: number;
}

export default function HealthBar({ current, max }: Props) {
  const pct = Math.max(0, current / max);
  const filled = Math.round(pct * SEGMENTS);
  const color = pct > 0.5 ? "#22c55e" : pct > 0.25 ? "#eab308" : "#ef4444";

  return (
    <div className="w-full">
      <div className="flex justify-between text-gray-400 mb-1" style={{ fontSize: 7 }}>
        <span>HP</span>
        <span>{current}/{max}</span>
      </div>
      <div className="flex gap-[2px]">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="h-3 flex-1"
            style={{ background: i < filled ? color : "#1f2937" }}
          />
        ))}
      </div>
    </div>
  );
}
