interface Props {
  onBack: () => void;
}

export default function RunCompleteScreen({ onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center gap-4">
        <span className="text-yellow-400 text-xl leading-relaxed">
          you win!
        </span>
        <span className="text-gray-400" style={{ fontSize: 9 }}>
          all 5 monsters defeated
        </span>
      </div>
      <button
        onClick={onBack}
        className="btn-pixel px-8 py-3 bg-yellow-500 text-gray-900 font-bold text-xs border-2 border-yellow-700"
      >
        return to menu
      </button>
    </div>
  );
}
