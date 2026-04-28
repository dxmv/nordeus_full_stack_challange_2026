interface Props {
  onStartGame: () => void;
  error?: string | null;
  loading?: boolean;
}

export default function MainMenu({ onStartGame, error, loading }: Props) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-12">
      <div className="w-64 h-40 bg-gray-700 border-2 border-dashed border-gray-500 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 text-lg font-semibold tracking-widest uppercase">
          Game Logo
        </span>
      </div>

      <div className="flex flex-col gap-4 w-56">
        <button
          onClick={onStartGame}
          disabled={loading}
          className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold text-lg tracking-widest uppercase rounded-xl transition-all duration-150 shadow-lg shadow-yellow-400/20"
        >
          {loading ? "Loading..." : "Start Game"}
        </button>
        <button className="w-full py-3 bg-transparent hover:bg-gray-700 active:scale-95 text-gray-300 hover:text-white font-bold text-lg tracking-widest uppercase rounded-xl border-2 border-gray-600 hover:border-gray-400 transition-all duration-150">
          Settings
        </button>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
