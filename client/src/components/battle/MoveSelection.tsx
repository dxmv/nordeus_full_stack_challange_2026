import type { Move } from "../../types";
import MoveCard from "./MoveCard";

interface Props {
  moves: Move[];
  onSelect: (move: Move) => void;
  disabled?: boolean;
}

export default function MoveSelection({ moves, onSelect, disabled }: Props) {
  return (
    <div className="w-full max-w-3xl grid grid-cols-4 gap-3 items-end">
      {moves.map((move) => (
        <MoveCard key={move.id} move={move} onSelect={onSelect} disabled={disabled} />
      ))}
    </div>
  );
}
