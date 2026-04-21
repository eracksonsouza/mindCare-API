import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { listCheckIns, createCheckIn, deleteCheckIns } from "../controllers/checkinsController";

const router = Router();

router.use(authMiddleware);

router.get("/", listCheckIns);
router.post("/", createCheckIn);
router.delete("/", deleteCheckIns);

export default router;
