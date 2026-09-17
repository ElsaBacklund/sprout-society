import { Router } from "express";
import { selectLevel } from "../controllers/paymentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/select-level", requireAuth, selectLevel);

export default router;
