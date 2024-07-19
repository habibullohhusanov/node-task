import express from "express";
import authMiddleware from "../app/middlewares/authMiddleware.js";
import { destroy, update, updatePassword } from "../app/controllers/userDataController.js";

const router = express.Router();

router.post("/update", authMiddleware, update);
router.post("/password", authMiddleware, updatePassword);
router.post("/destroy", authMiddleware, destroy);

export default router;
