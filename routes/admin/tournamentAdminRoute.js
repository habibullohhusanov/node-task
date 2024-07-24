import express from "express";
import authMiddleware from "../../app/middlewares/authMiddleware.js";
import adminMiddleware from "../../app/middlewares/adminMiddleware.js";
import { add, index, own, players, remove, show, store, update } from "../../app/controllers/admin/tournamentController.js";

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, index);
router.get('/own', authMiddleware, adminMiddleware, own);
router.get('/players', authMiddleware, adminMiddleware, players);
router.get('/:id', authMiddleware, adminMiddleware, show);
router.post('/', authMiddleware, adminMiddleware, store);
router.post('/add', authMiddleware, adminMiddleware, add);
router.post('/remove', authMiddleware, adminMiddleware, remove);
router.put('/:id', authMiddleware, adminMiddleware, update);

export default router;