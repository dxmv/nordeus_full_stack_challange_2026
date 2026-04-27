import express from "express";
import cors from "cors";
import runConfigRouter from "./routes/runConfig";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use("/api/run-config", runConfigRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
