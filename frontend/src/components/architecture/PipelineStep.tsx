import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PipelineStepProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

export default function PipelineStep({ step, title, description, icon, isLast }: PipelineStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step * 0.15 }}
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        {!isLast && <div className="w-px h-12 bg-border mt-2" />}
      </div>
      <div className="pt-1">
        <p className="text-xs text-muted-foreground mb-1">Step {step}</p>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </motion.div>
  );
}
