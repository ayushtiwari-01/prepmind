import { motion } from "framer-motion";
import { User, Monitor, Server, Cpu, Database, Brain, ArrowDown } from "lucide-react";

const steps = [
  { icon: <User className="h-5 w-5" />, title: "User", description: "Initiates a question request or submits an answer" },
  { icon: <Monitor className="h-5 w-5" />, title: "Frontend (React)", description: "Handles UI interactions, state management, and API calls" },
  { icon: <Server className="h-5 w-5" />, title: "Backend API", description: "Processes requests, manages sessions, and orchestrates AI services" },
  { icon: <Cpu className="h-5 w-5" />, title: "Embedding Model", description: "Converts text to vector embeddings for semantic search" },
  { icon: <Database className="h-5 w-5" />, title: "Vector Database", description: "Stores and retrieves similar questions using vector similarity" },
  { icon: <Brain className="h-5 w-5" />, title: "LLM (Large Language Model)", description: "Generates questions, evaluates answers, and provides feedback" },
  { icon: <ArrowDown className="h-5 w-5" />, title: "Generated Output", description: "Returns structured response back to the user interface" },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">System Architecture</h1>
        <p className="text-muted-foreground text-sm mt-1">How PrepMind processes your interview preparation</p>
      </div>

      <div className="max-w-xl">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-start gap-4 mb-1"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                {step.icon}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px h-10 bg-gradient-to-b from-primary/30 to-border mt-1" />
              )}
            </div>
            <div className="pt-1 pb-6">
              <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
