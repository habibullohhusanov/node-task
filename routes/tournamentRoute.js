import express from "express";
import { active, exit, finished, index, join, show } from "../app/controllers/tournamentConstroller.js";
import authMiddleware from "../app/middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", index);
router.get("/active", authMiddleware, active);
router.get("/finished", authMiddleware, finished);
router.get("/:id", show);
router.post("/join", authMiddleware, join);
router.post("/exit", authMiddleware, exit);

export default router;