import HealthBar from "./HealthBar";
import MoveAnimation, { type AnimKind } from "./MoveAnimation";
import Sprite from "./Sprite";
import type { SpriteCoords } from "../../types";

interface Props {
  label: string;
  hp: { current: number; max: number };
  sprite: SpriteCoords;
  flip?: boolean;
  anim?: AnimKind | null;
  animKey?: number;
}

export default function Combatant({ label, hp, sprite, flip, anim, animKey }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-40">
      <span className="text-gray-400 text-sm font-semibold tracking-widest uppercase">{label}</span>
      <div className="relative">
        <Sprite sprite={sprite} scale={4} flip={flip} />
        {anim && <MoveAnimation key={animKey} kind={anim} />}
      </div>
      <HealthBar current={hp.current} max={hp.max} />
    </div>
  );
}
