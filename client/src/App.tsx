import { useContext, useState } from "react";
import MainMenu from "./screens/MainMenu";
import BattleScreen from "./screens/BattleScreen";
import { RunConfigContext } from "./context/RunConfigContext";

type Screen = "menu" | "battle";

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const runConfigContext = useContext(RunConfigContext);

  const handleGameStart = async () => {
    const ok = await runConfigContext?.fetchConfig();
    if (ok) setScreen("battle");
  }

  if (screen === "battle") {
    return <BattleScreen onBack={() => setScreen("menu")} />;
  }

  return (
    <MainMenu
      onStartGame={handleGameStart}
      loading={runConfigContext?.loading}
      error={runConfigContext?.error}
    />
  );
}
