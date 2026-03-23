import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  sender: "ai" | "user";
  timestamp?: string;
}

export default function ChatBubble({ message, sender }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          sender === "user"
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-secondary text-secondary-foreground rounded-bl-md"
        }`}
      >
        {message}
      </div>
    </motion.div>
  );
}
