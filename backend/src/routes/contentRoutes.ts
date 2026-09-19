import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import {
  createContentPage,
  getAllContentPages,
  getContentPageById,
  updateContentPage,
  deleteContentPage,
} from "../controllers/contentController";

const router = Router();

// Alla inloggade användare kan lista/hämta innehåll
router.get("/", requireAuth, getAllContentPages);
router.get("/:id", requireAuth, getContentPageById);

// Bara admin kan skapa, uppdatera och ta bort innehållssidor
router.post("/", requireAuth, requireAdmin, createContentPage);
router.put("/:id", requireAuth, requireAdmin, updateContentPage);
router.delete("/:id", requireAuth, requireAdmin, deleteContentPage);

export default router;