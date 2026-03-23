import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorAlertProps {
  message: string;
  variant?: "error" | "success";
  onDismiss?: () => void;
}

export default function ErrorAlert({ message, variant = "error", onDismiss }: ErrorAlertProps) {
  const isError = variant === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${
        isError
          ? "bg-destructive/10 border-destructive/30 text-destructive"
          : "bg-primary/10 border-primary/30 text-primary"
      }`}
    >
      {isError ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}
