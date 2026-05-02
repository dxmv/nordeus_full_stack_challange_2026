interface Props {
  onBack: () => void;
}

export default function RunCompleteScreen({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <span className="text-5xl font-bold tracking-widest uppercase text-yellow-400">
          Run Complete!
        </span>
        <span className="text-gray-400 text-sm tracking-widest uppercase">
          You defeated all 5 monsters
        </span>
      </div>
      <button
        onClick={onBack}
        className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold tracking-widest uppercase rounded-xl transition-colors"
      >
        Return to Menu
      </button>
    </div>
  );
}
