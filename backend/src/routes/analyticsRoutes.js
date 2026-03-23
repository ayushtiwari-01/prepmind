import express from "express"
import protect from "../middleware/authMiddleware.js"

import {
  getDashboardAnalytics,
  getPerformanceAnalytics
} from "../controllers/analyticsController.js"

const router = express.Router()

router.get("/dashboard", protect, getDashboardAnalytics)

router.get("/performance", protect, getPerformanceAnalytics)

export default router