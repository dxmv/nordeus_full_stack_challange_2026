interface Props {
  current: number;
  max: number;
}

export default function HealthBar({ current, max }: Props) {
  const pct = Math.max(0, (current / max) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>HP</span>
        <span>{current} / {max}</span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
