import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getWeeklyAnalytics } from "../controllers/analyticsController";

const router = Router();

router.use(authMiddleware);
router.get("/weekly", getWeeklyAnalytics);

export default router;
