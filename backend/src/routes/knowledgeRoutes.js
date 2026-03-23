import express from "express"
import multer from "multer"
import { uploadKnowledge } from "../controllers/knowledgeController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/upload", protect, upload.single("file"), uploadKnowledge)

export default router