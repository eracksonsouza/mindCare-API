import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  listJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
} from "../controllers/journalController";

const router = Router();

router.use(authMiddleware);
router.get("/", listJournalEntries);
router.post("/", createJournalEntry);
router.delete("/:id", deleteJournalEntry);

export default router;
