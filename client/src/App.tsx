import { useContext, useState } from "react";
import MainMenu from "./screens/MainMenu";
import BattleScreen from "./screens/BattleScreen";
import MapScreen from "./screens/MapScreen";
import { RunConfigContext } from "./context/RunConfigContext";

type Screen = "menu" | "map" | "battle";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [monsterIndex, setMonsterIndex] = useState(0);
  const runConfigContext = useContext(RunConfigContext);

  const handleGameStart = async () => {
    const ok = await runConfigContext?.fetchConfig();
    if (ok) setScreen("map");
  };

  if (screen === "map") {
    return (
      <MapScreen
        onFight={(i) => { setMonsterIndex(i); setScreen("battle"); }}
        onBack={() => setScreen("menu")}
      />
    );
  }

  if (screen === "battle") {
    return <BattleScreen monsterIndex={monsterIndex} onBack={() => setScreen("map")} />;
  }

  return (
    <MainMenu
      onStartGame={handleGameStart}
      loading={runConfigContext?.loading}
      error={runConfigContext?.error}
    />
  );
}
