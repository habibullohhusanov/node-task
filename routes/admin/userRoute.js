import express from "express";
import authMiddleware from "../../app/middlewares/authMiddleware.js";
import adminMiddleware from "../../app/middlewares/adminMiddleware.js";
import { addPlayerData, destroy, index, newPassword, update, updatePlayerData, veiw } from "../../app/controllers/admin/userController.js";

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, index);
router.get('/:id', authMiddleware, adminMiddleware, veiw);
router.post('/player/:id', authMiddleware, adminMiddleware, addPlayerData);
router.put('/:id', authMiddleware, adminMiddleware, update);
router.put('/password/:id', authMiddleware, adminMiddleware, newPassword);
router.put('/player/:id', authMiddleware, adminMiddleware, updatePlayerData);
router.delete('/:id', authMiddleware, adminMiddleware, destroy);

export default router;