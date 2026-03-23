import InterviewSession from "../models/InterviewSession.js"
import { generateQuestionAI, evaluateAnswerAI } from "../services/aiService.js"



export const startInterview = async (req, res) => {

  try {

    const { topic, difficulty } = req.body

    if (!topic || !difficulty) {
      return res.status(400).json({
        message: "Topic and difficulty are required"
      })
    }

    const question = await generateQuestionAI(topic, difficulty)

    const session = await InterviewSession.create({
      user: req.user.id,
      topic,
      difficulty,
      questions: [
        {
          question: question.question,
          difficulty
        }
      ]
    })

    res.status(200).json({
      sessionId: session._id,
      question: question.question
    })

  } catch (error) {

    console.error("startInterview error:", error)

    res.status(500).json({
      message: "Failed to start interview"
    })

  }

}



export const submitAnswer = async (req, res) => {

  try {

    const { sessionId, answer } = req.body

    if (!sessionId || !answer) {
      return res.status(400).json({
        message: "sessionId and answer are required"
      })
    }

    const session = await InterviewSession.findOne({
      _id: sessionId,
      user: req.user.id
    })

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found"
      })
    }

    if (session.completed) {
      return res.status(400).json({
        message: "Interview already completed"
      })
    }

    const index = session.currentQuestion

    if (index >= session.questions.length) {
      return res.status(400).json({
        message: "No active question found"
      })
    }

    const question = session.questions[index].question

    const evaluation = await evaluateAnswerAI(question, answer)

    session.questions[index].answer = answer
    session.questions[index].score = evaluation.score
    session.questions[index].percentage = evaluation.score * 10
    session.questions[index].strengths = evaluation.strengths
    session.questions[index].improvements = evaluation.improvements

    session.currentQuestion += 1

    // End interview after 5 questions
    if (session.currentQuestion >= 5) {

      session.completed = true

      await session.save()

      const totalScore = session.questions.reduce((sum, q) => {
        return sum + (q.score || 0)
      }, 0)

      const averageScore = totalScore / session.questions.length
      const averagePercentage = averageScore * 10

      return res.status(200).json({
        completed: true,
        averageScore,
        averagePercentage,
        questions: session.questions
      })

    }

    const nextQuestion = await generateQuestionAI(
      session.topic,
      session.difficulty
    )

    session.questions.push({
      question: nextQuestion.question,
      difficulty: session.difficulty
    })

    await session.save()

    res.status(200).json({
      completed: false,
      evaluation,
      nextQuestion: nextQuestion.question
    })

  } catch (error) {

    console.error("submitAnswer error:", error)

    res.status(500).json({
      message: "Interview error"
    })

  }

}