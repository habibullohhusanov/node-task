import express from "express";
import authMiddleware from "../../app/middlewares/authMiddleware.js";
import superAdminMiddleware from "../../app/middlewares/superAdminMiddleware.js";
import { changeRole, destroy, index, show, store, update } from "../../app/controllers/admin/adminController.js";

const router = express.Router();

router.get("/", authMiddleware, superAdminMiddleware, index);
router.get("/:id", authMiddleware, superAdminMiddleware, show);
router.post("/", authMiddleware, superAdminMiddleware, store);
router.put("/:id", authMiddleware, superAdminMiddleware, update);
router.delete("/:id", authMiddleware, superAdminMiddleware, destroy);
router.put("/role/:id", authMiddleware, superAdminMiddleware, changeRole);


export default router;