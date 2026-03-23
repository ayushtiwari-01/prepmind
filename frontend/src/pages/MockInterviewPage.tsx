import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

import {
  runMockInterview,
  submitInterviewAnswer,
  type InterviewQuestionInsight
} from "@/services/ai-service"

export default function MockInterviewPage() {

  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Medium")

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [insights, setInsights] = useState<InterviewQuestionInsight[]>([])
  const [averageScore, setAverageScore] = useState<number | null>(null)
  const [averagePercentage, setAveragePercentage] = useState<number | null>(null)

  const MAX_QUESTIONS = 5

  const startInterview = async () => {

    setError(null)

    try {

      const interview = await runMockInterview(topic, difficulty)

      setSessionId(interview.id)
      setQuestion(interview.questions[0].question)
      setCompleted(false)
      setQuestionNumber(1)
      setInsights([])
      setAverageScore(null)
      setAveragePercentage(null)
      setAnswer("")

    } catch (e: any) {

      setError(e?.message || "Failed to start interview. Please try again.")

    }

  }

  const submitAnswer = async () => {

    if (!sessionId) return

    setError(null)

    try {

      const res = await submitInterviewAnswer(sessionId, answer)

      if (res.completed) {

        setCompleted(true)
        setQuestion("")

        if (res.questions && res.questions.length) {
          setInsights(res.questions)
        }

        if (typeof res.averageScore === "number") {
          setAverageScore(res.averageScore)
        }

        if (typeof res.averagePercentage === "number") {
          setAveragePercentage(res.averagePercentage)
        }

      } else if (res.nextQuestion) {

        setQuestion(res.nextQuestion)
        setQuestionNumber(prev => prev + 1)

        if (res.evaluation) {
          setInsights(prev => [
            ...prev,
            {
              question,
              answer,
              score: res.evaluation?.score,
              strengths: res.evaluation?.strengths ?? [],
              improvements: res.evaluation?.improvements ?? []
            }
          ])
        }

      }

      setAnswer("")

    } catch (e: any) {

      setError(e?.message || "Failed to submit answer. Please try again.")

    }

  }

  return (
    <div className="space-y-4">

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {!sessionId && (

        <div className="space-y-3">

          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Interview Topic"
          />

          <div className="flex items-center gap-4">

            <div className="relative inline-block">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="appearance-none bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 pr-8 rounded-md font-medium border-0 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-primary-foreground">
                ▾
              </div>
            </div>

            <Button onClick={startInterview}>
              {completed ? "Start New Interview" : "Start Interview"}
            </Button>

          </div>

        </div>

      )}

      {question && !completed && (

        <div className="space-y-3">

          <div className="flex items-center justify-between">
            <p className="font-semibold">{question}</p>
            <span className="text-sm text-muted-foreground">
              Question {questionNumber} of {MAX_QUESTIONS}
            </span>
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
          />

          <Button onClick={submitAnswer}>
            Submit Answer
          </Button>

        </div>

      )}

      {completed && (

        <div className="space-y-4">

          <div className="text-green-500 font-semibold">
            Interview Completed
          </div>

          {(averageScore !== null || averagePercentage !== null) && (
            <div className="text-sm">
              {averageScore !== null && (
                <p>Average Score: {averageScore.toFixed(2)}/10</p>
              )}
              {averagePercentage !== null && (
                <p>Average Percentage: {averagePercentage.toFixed(1)}%</p>
              )}
            </div>
          )}

          {insights.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Question Insights</h3>

              {insights.map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded p-3 space-y-1 text-sm"
                >
                  <p className="font-medium">
                    Q{idx + 1}: {item.question}
                  </p>
                  {item.answer && (
                    <p>
                      <span className="font-medium">Your answer:</span>{" "}
                      {item.answer}
                    </p>
                  )}
                  {typeof item.score === "number" && (
                    <p>
                      <span className="font-medium">Score:</span>{" "}
                      {item.score}/10
                    </p>
                  )}
                  {item.strengths && item.strengths.length > 0 && (
                    <div>
                      <p className="font-medium">Strengths:</p>
                      <ul className="list-disc list-inside">
                        {item.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.improvements && item.improvements.length > 0 && (
                    <div>
                      <p className="font-medium">Improvements:</p>
                      <ul className="list-disc list-inside">
                        {item.improvements.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={() => {
              setSessionId(null);
              setQuestion("");
              setAnswer("");
              setCompleted(false);
              setError(null);
              setQuestionNumber(1);
              setInsights([]);
              setAverageScore(null);
              setAveragePercentage(null);
              setTopic("");
              setDifficulty("Medium");
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start New Interview
          </Button>

        </div>

      )}

    </div>
  )
}