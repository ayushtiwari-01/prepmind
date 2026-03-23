import express from "express"

import {
generateQuestion,
evaluateAnswer
} from "../controllers/questionController.js"

import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/generate",protect,generateQuestion)

router.post("/evaluate",protect,evaluateAnswer)

export default router