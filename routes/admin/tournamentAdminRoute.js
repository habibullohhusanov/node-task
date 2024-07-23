import express from "express";
import authMiddleware from "../../app/middlewares/authMiddleware.js";
import adminMiddleware from "../../app/middlewares/adminMiddleware.js";
import { index, show, store, update } from "../../app/controllers/admin/tournamentController.js";

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, index);
router.get('/:id', authMiddleware, adminMiddleware, show);
router.post('/', authMiddleware, adminMiddleware, store);
router.post('/add', authMiddleware, adminMiddleware, index);
router.post('/remove', authMiddleware, adminMiddleware, index);
router.put('/:id', authMiddleware, adminMiddleware, update);

export default router;