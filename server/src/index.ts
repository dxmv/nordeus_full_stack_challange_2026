import express from "express";
import cors from "cors";
import runConfigRouter from "./routes/runConfig";
import monsterMoveRouter from "./routes/monsterMove";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/api/run-config", runConfigRouter);
app.use("/api/monster-move", monsterMoveRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
