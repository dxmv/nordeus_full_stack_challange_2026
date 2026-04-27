import { Router, Request, Response } from "express";
import { MONSTERS } from "../data/monsters";
import { RunConfig } from "../types";

const router = Router();

// GET /api/run-config
// Returns the full battle configuration for a run: all 5 monsters in encounter order.
router.get("/", (_req: Request, res: Response) => {
  const config: RunConfig = { monsters: MONSTERS };
  res.json(config);
});

export default router;
