import { useState, useCallback } from "react";
import { Question, Answer } from "@/types";
import { generateQuestion, evaluateAnswer } from "@/services/ai-service";

export function useQuestionGenerator() {

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async (topic?: string, difficulty?: string) => {

    setLoading(true);

    try {

      const res = await generateQuestion(topic, difficulty);

      const q: Question = {
        id: res.id,
        topic: res.topic || topic || "General",
        difficulty: res.difficulty as "easy" | "medium" | "hard",
        question: res.question,
        category: res.category,
        tags: res.tags
      };

      setQuestion(q);

    } finally {

      setLoading(false);

    }

  }, []);

  return { question, loading, generate };

}

export function useAnswerEvaluation() {

  const [evaluation, setEvaluation] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);

  const evaluate = useCallback(async (questionText: string, answerText: string) => {

    setLoading(true);

    try {

      const result = await evaluateAnswer(questionText, answerText);

      const formatted: Answer = {
        questionId: result.questionId,
        answer: result.answer,
        score: result.score,
        feedback: result.feedback,
        strengths: result.strengths ?? [],
        improvements: result.improvements ?? []
      };

      setEvaluation(formatted);

      return formatted;

    } finally {

      setLoading(false);

    }

  }, []);

  const reset = useCallback(() => {
    setEvaluation(null);
  }, []);

  return { evaluation, loading, evaluate, reset };

}