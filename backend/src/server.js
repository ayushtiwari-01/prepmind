import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import interviewRoutes from "./routes/interviewRoutes.js"
import questionRoutes from "./routes/questionRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import connectDB from "./config/db.js"
import resumeRoutes from "./routes/resumeRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import historyRoutes from "./routes/historyRoutes.js"
import knowledgeRoutes from "./routes/knowledgeRoutes.js"

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "PrepMind API running" })
})


app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes)
app.use("/api/interview",interviewRoutes)
app.use("/api/resume", resumeRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/practice/history", historyRoutes)
app.use("/api/knowledge", knowledgeRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message)
  res.status(500).json({ message: "Internal server error", error: err.message })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})