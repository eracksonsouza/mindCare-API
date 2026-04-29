import { Router } from "express";
import { register, login } from "../controllers/avatarAuthController";

const router = Router();

router.post("/avatar/register", register);
router.post("/avatar/login", login);

export default router;
