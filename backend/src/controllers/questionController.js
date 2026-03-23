import { generateQuestionAI, evaluateAnswerAI } from "../services/aiService.js"

export const generateQuestion = async (req, res) => {
  try {
    const { topic, difficulty } = req.body

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty are required" })
    }

    const result = await generateQuestionAI(topic, difficulty)
    res.status(200).json(result)

  } catch (error) {
    console.error("generateQuestion error:", error.message)
    res.status(500).json({ message: "Failed to generate question", error: error.message })
  }
}

export const evaluateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" })
    }

    const evaluation = await evaluateAnswerAI(question, answer)
    res.status(200).json(evaluation)

  } catch (error) {
    console.error("evaluateAnswer error:", error.message)
    res.status(500).json({ message: "Evaluation failed", error: error.message })
  }
}