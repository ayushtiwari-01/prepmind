import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import QuestionCard from "@/components/interview/QuestionCard";
import EmptyState from "@/components/ui/empty-state";
import ErrorAlert from "@/components/ui/error-alert";

import {
  useQuestionGenerator,
  useAnswerEvaluation
} from "@/hooks/useQuestionGenerator";

import {
  Sparkles,
  Send,
  RotateCcw,
  HelpCircle,
  ArrowRight
} from "lucide-react";

import { formatScore, getScoreColor } from "@/utils/formatScore";

const topics = [
  "React",
  "System Design",
  "Data Structures",
  "Node.js",
  "Databases",
  "TypeScript",
  "CSS",
  "Algorithms"
];

const difficulties = ["Easy", "Medium", "Hard"];

export default function PracticePage() {

  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { question, loading: genLoading, generate } =
    useQuestionGenerator();

  const {
    evaluation,
    loading: evalLoading,
    evaluate,
    reset: resetEval
  } = useAnswerEvaluation();

  const handleGenerate = async () => {

    setError(null);

    try {

      await generate(
        selectedTopic || undefined,
        selectedDifficulty || undefined
      );

      setAnswer("");
      resetEval();

    } catch {

      setError("Failed to generate question. Please try again.");

    }
  };

  const handleSubmitAnswer = async () => {

    if (!question || !answer.trim()) return;

    setError(null);

    try {

      await evaluate(question.question, answer);

    } catch {

      setError("Unable to evaluate answer. Please try again.");

    }
  };

  const handleNextQuestion = () => {

    setAnswer("");
    resetEval();
    handleGenerate();

  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Practice Questions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate and practice interview questions on any topic
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="flex items-center gap-3">

        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Select topic" />
          </SelectTrigger>

          <SelectContent>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>

        </Select>

        <Select
          value={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
        >

          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            {difficulties.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>

        </Select>

        <Button
          onClick={handleGenerate}
          disabled={genLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >

          <Sparkles className="h-4 w-4" />

          {genLoading
            ? "Generating..."
            : "Generate Question"}

        </Button>

      </div>

      {!question ? (

        <EmptyState
          icon={HelpCircle}
          title="No question yet"
          description="Select a topic and generate a question to start practicing."
        />

      ) : (

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >

          <QuestionCard question={question} />

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">

            <h3 className="text-sm font-semibold">
              Your Answer
            </h3>

            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[120px] bg-secondary border-border resize-none"
            />

            <div className="flex gap-3">

              <Button
                onClick={handleSubmitAnswer}
                disabled={evalLoading || !answer.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >

                <Send className="h-4 w-4" />

                {evalLoading
                  ? "Evaluating..."
                  : "Submit Answer"}

              </Button>

              <Button
                variant="outline"
                onClick={() => setAnswer("")}
                className="border-border hover:bg-secondary gap-2"
              >

                <RotateCcw className="h-4 w-4" />

                Clear

              </Button>

            </div>

          </div>

          {evaluation && (

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >

              <div className="bg-card border border-border rounded-xl p-5 space-y-4">

                <div className="flex items-center justify-between">

                  <h3 className="text-sm font-semibold">
                    AI Evaluation
                  </h3>

                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      evaluation.score
                    )}`}
                  >

                    {formatScore(evaluation.score)}

                  </span>

                </div>

                <p className="text-sm text-muted-foreground">
                  {evaluation.feedback}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <h4 className="text-xs font-semibold text-success mb-2">
                      Strengths
                    </h4>

                    <ul className="space-y-1">

                      {evaluation.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >

                          <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />

                          {s}

                        </li>
                      ))}

                    </ul>

                  </div>

                  <div>

                    <h4 className="text-xs font-semibold text-warning mb-2">
                      Improvements
                    </h4>

                    <ul className="space-y-1">

                      {evaluation.improvements.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >

                          <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />

                          {s}

                        </li>
                      ))}

                    </ul>

                  </div>

                </div>

              </div>

              <Button
                onClick={handleNextQuestion}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >

                <ArrowRight className="h-4 w-4" />

                Next Question

              </Button>

            </motion.div>

          )}

        </motion.div>

      )}

    </div>
  );
}