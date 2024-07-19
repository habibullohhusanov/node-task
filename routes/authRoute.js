import express from "express";
import authMiddleware from "../app/middlewares/authMiddleware.js";
import { login, register, user, } from "../app/controllers/authController.js"; // logout, verify

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
// router.post("/logout", authMiddleware, logout);
router.get("/user", authMiddleware, user);
// router.get("/verify", authMiddleware, verify);

export default router;