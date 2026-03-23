import express from "express"
import protect from "../middleware/authMiddleware.js"
import { analyzeResume } from "../controllers/resumeController.js"
import multer from "multer"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/analyze", protect, upload.single("resume"), analyzeResume)

export default router