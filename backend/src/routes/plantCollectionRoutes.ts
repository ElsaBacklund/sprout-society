import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  addPlant,
  getMyPlants,
  markDone,
  deletePlant,
} from "../controllers/plantCollectionController";

const router = Router();

// Alla routes kräver att användaren är inloggad
router.post("/", requireAuth, addPlant);
router.get("/", requireAuth, getMyPlants);
router.post("/:id/mark-done", requireAuth, markDone);
router.delete("/:id", requireAuth, deletePlant);

export default router;