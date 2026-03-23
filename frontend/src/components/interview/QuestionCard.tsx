import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  onClick?: () => void;
}

export default function QuestionCard({ question, onClick }: QuestionCardProps) {
  const difficultyColor = {
    easy: "bg-success/10 text-success border-success/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    hard: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-5 cursor-pointer transition-shadow hover:shadow-lg hover:border-primary/20"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant="outline" className={difficultyColor[question.difficulty]}>
          {question.difficulty}
        </Badge>
        <span className="text-xs text-muted-foreground">{question.category}</span>
      </div>
      <h3 className="text-sm font-medium text-foreground leading-relaxed">{question.question}</h3>
      <div className="flex gap-2 mt-3">
        {question.tags.map((tag) => (
          <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
