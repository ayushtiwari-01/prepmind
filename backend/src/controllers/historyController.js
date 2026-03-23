import InterviewSession from "../models/InterviewSession.js"

export const getPracticeHistory = async (req, res) => {

  try {

    const userId = req.user.id

    const sessions = await InterviewSession.find({
      user: userId
    })
      .sort({ createdAt: -1 })
      .limit(20)

    const history = sessions.map(session => {

      const avgScore =
        session.questions.reduce((sum, q) => sum + (q.score || 0), 0) /
        session.questions.length

      return {
        topic: session.topic,
        difficulty: session.difficulty,
        averageScore: avgScore,
        date: session.createdAt
      }

    })

    res.json(history)

  } catch (error) {

    console.error("Practice history error:", error)

    res.status(500).json({
      message: "Failed to fetch history"
    })

  }

}