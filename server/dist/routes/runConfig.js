"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monsters_1 = require("../data/monsters");
const router = (0, express_1.Router)();
// GET /api/run-config
// Returns the full battle configuration for a run: all 5 monsters in encounter order.
router.get("/", (_req, res) => {
    const config = { monsters: monsters_1.MONSTERS };
    res.json(config);
});
exports.default = router;
