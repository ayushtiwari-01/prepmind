import { motion } from "framer-motion";
import PipelineStep from "@/components/architecture/PipelineStep";
import { ListChecks, Search, Brain, MessageSquare, CheckCircle } from "lucide-react";

const pipelineSteps = [
  { icon: <ListChecks className="h-5 w-5" />, title: "User Selects Topic", description: "The user picks a specific topic or technology they want to practice." },
  { icon: <Search className="h-5 w-5" />, title: "Vector Search", description: "The system retrieves relevant questions from the knowledge base using vector similarity search." },
  { icon: <Brain className="h-5 w-5" />, title: "LLM Question Generation", description: "A large language model generates a contextual interview question based on retrieved data." },
  { icon: <MessageSquare className="h-5 w-5" />, title: "User Answers", description: "The user provides their answer in natural language through the chat interface." },
  { icon: <CheckCircle className="h-5 w-5" />, title: "AI Evaluation", description: "The AI evaluates the answer for accuracy, completeness, and communication clarity, then provides detailed feedback." },
];

export default function HowAIWorksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">How AI Works</h1>
        <p className="text-muted-foreground text-sm mt-1">Understanding the AI pipeline behind PrepMind</p>
      </div>

      <div className="max-w-xl">
        {pipelineSteps.map((step, i) => (
          <PipelineStep
            key={step.title}
            step={i + 1}
            title={step.title}
            description={step.description}
            icon={step.icon}
            isLast={i === pipelineSteps.length - 1}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card border border-border rounded-xl p-6 max-w-xl"
      >
        <h3 className="text-sm font-semibold mb-2">Key Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {["RAG Pipeline", "Vector Embeddings", "Semantic Search", "GPT-4 / LLM", "Prompt Engineering", "Cosine Similarity"].map((tech) => (
            <span key={tech} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">{tech}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
