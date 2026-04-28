import HealthBar from "./HealthBar";

interface Props {
  label: string;
  hp: { current: number; max: number };
}

export default function Combatant({ label, hp }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-48">
      <div className="w-32 h-32 bg-gray-700 border-2 border-dashed border-gray-500 rounded-xl flex items-center justify-center">
        <span className="text-gray-400 font-bold text-xl tracking-widest">{label}</span>
      </div>
      <HealthBar current={hp.current} max={hp.max} />
    </div>
  );
}
