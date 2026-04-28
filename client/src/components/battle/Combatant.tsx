import HealthBar from "./HealthBar";
import Sprite from "./Sprite";
import type { SpriteCoords } from "../../types";

interface Props {
  label: string;
  hp: { current: number; max: number };
  sprite: SpriteCoords;
}

export default function Combatant({ label, hp, sprite }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-40">
      <span className="text-gray-400 text-sm font-semibold tracking-widest uppercase">{label}</span>
      <Sprite sprite={sprite} scale={4} />
      <HealthBar current={hp.current} max={hp.max} />
    </div>
  );
}
