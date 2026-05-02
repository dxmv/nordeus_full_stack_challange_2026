import { useContext, useState } from "react";
import MainMenu from "./screens/MainMenu";
import BattleScreen from "./screens/BattleScreen";
import MapScreen from "./screens/MapScreen";
import RunCompleteScreen from "./screens/RunCompleteScreen";
import { RunConfigContext } from "./context/RunConfigContext";

type Screen = "menu" | "map" | "battle" | "run-complete";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [clearedCount, setClearedCount] = useState(0);
  const runConfigContext = useContext(RunConfigContext);

  const handleGameStart = async () => {
    const ok = await runConfigContext?.fetchConfig();
    if (ok) {
      setClearedCount(0);
      setScreen("map");
    }
  };

  const handleWin = () => {
    const next = clearedCount + 1;
    setClearedCount(next);
    if (next >= 5) {
      setScreen("run-complete");
    } else {
      setScreen("map");
    }
  };

  if (screen === "map") {
    return (
      <MapScreen
        clearedCount={clearedCount}
        onFight={(i) => { setMonsterIndex(i); setScreen("battle"); }}
        onBack={() => setScreen("menu")}
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
        onBack={() => { setClearedCount(0); setScreen("menu"); }}
      />
    );
  }

  return (
    <MainMenu
      onStartGame={handleGameStart}
      loading={runConfigContext?.loading}
      error={runConfigContext?.error}
    />
  );
}
