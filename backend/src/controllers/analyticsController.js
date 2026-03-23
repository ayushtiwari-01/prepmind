import InterviewSession from "../models/InterviewSession.js"

export const getDashboardAnalytics = async (req, res) => {

  try {

    const userId = req.user.id

    const sessions = await InterviewSession.find({
      user: userId,
      completed: true
    })

    const totalInterviews = sessions.length

    if (totalInterviews === 0) {
      return res.json({
        totalInterviews: 0,
        averageScore: 0,
        averagePercentage: 0,
        performanceByDifficulty: {},
        recentInterviews: []
      })
    }

    let totalScore = 0
    let totalQuestions = 0

    const difficultyScores = {}

    sessions.forEach(session => {

      session.questions.forEach(q => {

        if (q.score) {
          totalScore += q.score
          totalQuestions++
        }

      })

      const avgSessionScore =
        session.questions.reduce((sum, q) => sum + (q.score || 0), 0) /
        session.questions.length

      if (!difficultyScores[session.difficulty]) {
        difficultyScores[session.difficulty] = []
      }

      difficultyScores[session.difficulty].push(avgSessionScore)

    })

    const averageScore = totalScore / totalQuestions
    const averagePercentage = averageScore * 10

    const performanceByDifficulty = {}

    for (const difficulty in difficultyScores) {

      const avg =
        difficultyScores[difficulty].reduce((a, b) => a + b, 0) /
        difficultyScores[difficulty].length

      performanceByDifficulty[difficulty] = Math.round(avg * 10)

    }

    const recentInterviews = sessions
      .slice(-5)
      .reverse()
      .map(s => ({
        topic: s.topic,
        difficulty: s.difficulty,
        score:
          s.questions.reduce((sum, q) => sum + (q.score || 0), 0) /
          s.questions.length
      }))

    res.json({
      totalInterviews,
      averageScore,
      averagePercentage,
      performanceByDifficulty,
      recentInterviews
    })

  } catch (error) {

    console.error("Analytics error:", error)

    res.status(500).json({
      message: "Failed to fetch analytics"
    })

  }

}


export const getPerformanceAnalytics = async (req, res) => {

  try {

    const userId = req.user.id

    const sessions = await InterviewSession.find({
      user: userId,
      completed: true
    })

    if (sessions.length === 0) {
      return res.json({
        topicPerformance: {},
        difficultyPerformance: {}
      })
    }

    const topicScores = {}
    const difficultyScores = {}

    sessions.forEach(session => {

      const sessionScore =
        session.questions.reduce((sum, q) => sum + (q.score || 0), 0) /
        session.questions.length

      // Topic performance
      if (!topicScores[session.topic]) {
        topicScores[session.topic] = []
      }
      topicScores[session.topic].push(sessionScore)

      // Difficulty performance
      if (!difficultyScores[session.difficulty]) {
        difficultyScores[session.difficulty] = []
      }
      difficultyScores[session.difficulty].push(sessionScore)

    })

    const topicPerformance = {}
    const difficultyPerformance = {}

    for (const topic in topicScores) {

      const avg =
        topicScores[topic].reduce((a, b) => a + b, 0) /
        topicScores[topic].length

      topicPerformance[topic] = Math.round(avg * 10)

    }

    for (const difficulty in difficultyScores) {

      const avg =
        difficultyScores[difficulty].reduce((a, b) => a + b, 0) /
        difficultyScores[difficulty].length

      difficultyPerformance[difficulty] = Math.round(avg * 10)

    }

    res.json({
      topicPerformance,
      difficultyPerformance
    })

  } catch (error) {

    console.error("Performance analytics error:", error)

    res.status(500).json({
      message: "Failed to fetch performance analytics"
    })

  }

}