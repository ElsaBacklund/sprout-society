import { Router } from "express";
import { getMyReceipts } from "../controllers/receiptController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getMyReceipts);

export default router;
