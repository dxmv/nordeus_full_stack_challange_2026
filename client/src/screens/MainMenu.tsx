interface Props {
  onStartGame: () => void;
  error?: string | null;
  loading?: boolean;
  hasSave?: boolean;
  onContinue?: () => void;
}

export default function MainMenu({ onStartGame, error, loading, hasSave, onContinue }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12">
      {/* Title */}
      <div className="flex flex-col items-center gap-4">
        <div className="pixel-panel bg-gray-800 px-8 py-6">
          <span className="text-yellow-400 text-base leading-relaxed tracking-wide">
            RPG
          </span>
          <br />
          <span className="text-yellow-400 text-base leading-relaxed tracking-wide">
            GAUNTLET
          </span>
        </div>
        <span className="text-gray-500" style={{ fontSize: 8 }}>
          defeat 5 monsters to win
        </span>
      </div>

      <div className="flex flex-col gap-4 w-56">
        {hasSave && onContinue && (
          <button
            onClick={onContinue}
            className="btn-pixel w-full py-3 bg-green-600 text-white font-bold text-xs border-2 border-green-800"
          >
            continue
          </button>
        )}
        <button
          onClick={onStartGame}
          disabled={loading}
          className="btn-pixel w-full py-3 bg-yellow-400 text-gray-900 font-bold text-xs border-2 border-yellow-600"
        >
          {loading ? "loading..." : "start game"}
        </button>
        <button
          onClick={() => window.close()}
          className="btn-pixel w-full py-3 bg-gray-700 text-gray-400 font-bold text-xs border-2 border-gray-600"
        >
          exit
        </button>

        {error && (
          <p className="text-red-400 text-center" style={{ fontSize: 8 }}>{error}</p>
        )}
      </div>
    </div>
  );
}
