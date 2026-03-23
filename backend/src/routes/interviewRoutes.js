import express from "express"

import protect from "../middleware/authMiddleware.js"

import {
startInterview,
submitAnswer
} from "../controllers/interviewController.js"

const router = express.Router()

router.post("/start",protect,startInterview)

router.post("/answer",protect,submitAnswer)

export default router