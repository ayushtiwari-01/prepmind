import { Question, Answer, InterviewSession, ResumeAnalysis, AnalyticsData } from "@/types"

const API_BASE = "http://localhost:3001/api"

function getAuthHeaders() {
  const token = localStorage.getItem("authToken")

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

/* ----------------------------- */
/* Generate Question */
/* ----------------------------- */

export async function generateQuestion(topic?: string, difficulty?: string): Promise<Question> {

  const res = await fetch(`${API_BASE}/questions/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      topic,
      difficulty
    })
  })

  if (!res.ok) throw new Error("Failed to generate question")

  const data = await res.json()

  return {
    id: crypto.randomUUID(),
    topic: topic || "General",
    difficulty: (data.difficulty || "medium").toLowerCase(),
    question: data.question,
    category: data.category || "General",
    tags: data.tags || []
  }
}

/* ----------------------------- */
/* Evaluate Answer */
/* ----------------------------- */

export async function evaluateAnswer(question: string, answer: string): Promise<Answer> {

  const res = await fetch(`${API_BASE}/questions/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      question,
      answer
    })
  })

  if (!res.ok) throw new Error("Evaluation failed")

  const data = await res.json()

  return {
    questionId: question,
    answer,
    score: data.score,
    feedback: "AI evaluation completed.",
    strengths: data.strengths || [],
    improvements: data.improvements || []
  }
}

/* ----------------------------- */
/* Start Mock Interview */
/* ----------------------------- */


export async function runMockInterview(topic: string, difficulty: string) {

  const res = await fetch(`${API_BASE}/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      topic,
      difficulty
    })
  })

  if (!res.ok) throw new Error("Failed to start interview")

  const data = await res.json()

  return {
    id: data.sessionId,
    topic,
    questions: [
      {
        id: crypto.randomUUID(),
        topic,
        difficulty,
        question: data.question,
        category: "Interview",
        tags: []
      }
    ],
    answers: [],
    overallScore: 0,
    startedAt: new Date().toISOString(),
    status: "in-progress"
  }
}


/* ----------------------------- */
/* Submit Interview Answer */
/* ----------------------------- */

export interface InterviewQuestionInsight {
  question: string
  answer?: string
  score?: number
  strengths?: string[]
  improvements?: string[]
}

export interface InterviewEvaluation {
  score: number
  strengths: string[]
  improvements: string[]
}

export interface InterviewAnswerResponse {
  completed: boolean
  nextQuestion?: string
  evaluation?: InterviewEvaluation
  averageScore?: number
  averagePercentage?: number
  questions?: InterviewQuestionInsight[]
}

export async function submitInterviewAnswer(
  sessionId: string,
  answer: string
): Promise<InterviewAnswerResponse> {

  const res = await fetch(`${API_BASE}/interview/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify({
      sessionId,
      answer
    })
  })

  if (!res.ok) throw new Error("Interview submission failed")

  const data: InterviewAnswerResponse = await res.json()

  return data
}

/* ----------------------------- */
/* Resume Analyzer */
/* ----------------------------- */

export async function analyzeResume(
  file: File,
  role: string
): Promise<ResumeAnalysis> {

  const token = localStorage.getItem("authToken")

  const formData = new FormData()
  // backend expects field name "resume" and a "role" in the body
  formData.append("resume", file)
  formData.append("role", role)

  const res = await fetch(`${API_BASE}/resume/analyze`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  })

  if (!res.ok) throw new Error("Resume analysis failed")

  const data = await res.json()

  const result: ResumeAnalysis = {
    role: data.role,
    score: data.score,
    strengths: data.strengths ?? [],
    weaknesses: data.weaknesses ?? [],
    missingSkills: data.missingSkills ?? [],
    suggestions: data.suggestions ?? []
  }

  return result
}

/* ----------------------------- */
/* Analytics */
/* ----------------------------- */

export async function getAnalyticsData(): Promise<AnalyticsData> {

  const [dashboardRes, performanceRes] = await Promise.all([
    fetch(`${API_BASE}/analytics/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    }),
    fetch(`${API_BASE}/analytics/performance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    })
  ])

  if (!dashboardRes.ok || !performanceRes.ok) {
    throw new Error("Failed to load analytics")
  }

  const dashboard = await dashboardRes.json()
  const performance = await performanceRes.json()

  const topicPerformance = Object.entries(performance.topicPerformance || {}).map(
    ([topic, score]) => ({
      topic,
      score: typeof score === "number" ? score : Number(score) || 0
    })
  )

  const performanceByDifficulty = Object.entries(
    dashboard.performanceByDifficulty || {}
  ).map(([difficulty, score]) => ({
    difficulty,
    score: typeof score === "number" ? score : Number(score) || 0
  }))

  const recentInterviews = (dashboard.recentInterviews || []).map(
    (item: any) => ({
      topic: item.topic,
      difficulty: item.difficulty,
      // backend returns average score on 0-10 scale; convert to percentage
      score: Math.round((item.score || 0) * 10)
    })
  )

  const data: AnalyticsData = {
    totalInterviews: dashboard.totalInterviews ?? 0,
    averageScore:
      typeof dashboard.averagePercentage === "number"
        ? dashboard.averagePercentage
        : Math.round((dashboard.averageScore || 0) * 10),
    performanceByDifficulty,
    topicPerformance,
    recentInterviews
  }

  return data
}

/* ----------------------------- */
/* Practice History */
/* ----------------------------- */

export interface PracticeHistoryItem {
  topic: string
  difficulty: string
  averageScore: number
  date: string
}

export async function getPracticeHistory(): Promise<PracticeHistoryItem[]> {

  const res = await fetch(`${API_BASE}/practice/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    }
  })

  if (!res.ok) throw new Error("Failed to load practice history")

  return res.json()
}