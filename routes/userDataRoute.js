import express from "express";
import authMiddleware from "../app/middlewares/authMiddleware.js";
import { destroy, store, update, updateData, updatePassword, view } from "../app/controllers/userDataController.js";

const router = express.Router();

router.get("/player", authMiddleware, view);
router.post("/player", authMiddleware, store);
router.put("/player", authMiddleware, update);
router.put("/update", authMiddleware, updateData);
router.put("/password", authMiddleware, updatePassword);
router.delete("/delete", authMiddleware, destroy);

export default router;
