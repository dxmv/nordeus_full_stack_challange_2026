import { useContext, useState } from "react";
import MainMenu from "./screens/MainMenu";
import BattleScreen from "./screens/BattleScreen";
import MapScreen from "./screens/MapScreen";
import RunCompleteScreen from "./screens/RunCompleteScreen";
import { RunConfigContext } from "./context/RunConfigContext";
import { usePlayer } from "./context/PlayerContext";
import { saveGame, loadGame, hasSave, clearSave } from "./utils/save";

type Screen = "menu" | "map" | "battle" | "run-complete";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [clearedCount, setClearedCount] = useState(0);
  const runConfigContext = useContext(RunConfigContext);
  const { player, restorePlayer } = usePlayer();

  const saveExists = hasSave();

  const handleGameStart = async () => {
    clearSave();
    const ok = await runConfigContext?.fetchConfig();
    if (ok) {
      setClearedCount(0);
      setScreen("map");
    }
  };

  const handleContinue = () => {
    const save = loadGame();
    if (!save) return;
    restorePlayer(save.player);
    runConfigContext?.restoreConfig(save.config);
    setClearedCount(save.clearedCount);
    setScreen("map");
  };

  const handleSaveAndExit = () => {
    const config = runConfigContext?.config;
    if (!config) return;
    saveGame({ player, clearedCount, config, savedAt: new Date().toISOString() });
    setScreen("menu");
  };

  const handleWin = () => {
    if (monsterIndex === clearedCount) {
      const next = clearedCount + 1;
      setClearedCount(next);
      if (next >= 5) {
        setScreen("run-complete");
        return;
      }
    }
    setScreen("map");
  };

  if (screen === "map") {
    return (
      <MapScreen
        clearedCount={clearedCount}
        onFight={(i) => { setMonsterIndex(i); setScreen("battle"); }}
        onBack={() => setScreen("menu")}
        onSaveAndExit={handleSaveAndExit}
      />
    );
  }

  if (screen === "battle") {
    return (
      <BattleScreen
        monsterIndex={monsterIndex}
        onWin={handleWin}
        onBack={() => setScreen("map")}
      />
    );
  }

  if (screen === "run-complete") {
    return (
      <RunCompleteScreen
        onBack={() => { clearSave(); setClearedCount(0); setScreen("menu"); }}
      />
    );
  }

  return (
    <MainMenu
      onStartGame={handleGameStart}
      loading={runConfigContext?.loading}
      error={runConfigContext?.error}
      hasSave={saveExists}
      onContinue={handleContinue}
    />
  );
}
