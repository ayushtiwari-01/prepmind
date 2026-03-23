import express from "express"
import protect from "../middleware/authMiddleware.js"
import { getPracticeHistory } from "../controllers/historyController.js"

const router = express.Router()

router.get("/", protect, getPracticeHistory)

export default router