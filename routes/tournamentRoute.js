import express from "express";
import { index } from "../app/controllers/tournamentConstroller.js";

const router = express.Router();

router.get("/", index);

export default router;