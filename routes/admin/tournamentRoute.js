import express from "express";
import authMiddleware from "../../app/middlewares/authMiddleware";

const router = express.Router();

router.post('/', authMiddleware, )