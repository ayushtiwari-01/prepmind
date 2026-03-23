import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Sparkles, Target, BarChart3, FileText, Mic, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChatBubble from "@/components/interview/ChatBubble";

const features = [
  { icon: Sparkles, title: "AI Question Generation", description: "Practice with questions tailored to your skill level and target role." },
  { icon: Target, title: "Smart Evaluation", description: "Get instant, detailed feedback on your answers with scoring." },
  { icon: Mic, title: "Mock Interviews", description: "Simulate real interview experiences with AI-powered conversations." },
  { icon: FileText, title: "Resume Analysis", description: "Get your resume scored and receive actionable improvement tips." },
  { icon: BarChart3, title: "Progress Analytics", description: "Track your preparation journey with detailed performance insights." },
  { icon: Zap, title: "Adaptive Learning", description: "Questions adapt based on your strengths and weaknesses." },
];

const demoConversation = [
  { sender: "ai" as const, message: "Let's start your interview. Here's your question: Explain the difference between REST and GraphQL APIs. When would you choose one over the other?" },
  { sender: "user" as const, message: "REST uses fixed endpoints with HTTP methods, while GraphQL has a single endpoint where clients specify exactly what data they need. I'd choose REST for simple CRUD APIs and GraphQL when the frontend needs flexibility in data fetching to avoid over/under-fetching." },
  { sender: "ai" as const, message: "Score: 82/100 — Strong answer! You correctly identified the key architectural difference. To improve: mention schema typing in GraphQL, discuss caching trade-offs, and reference real-world scenarios like mobile apps where bandwidth optimization matters." },
];

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold tracking-tight">PrepMind</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(258_90%_66%/0.12),transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Interview Preparation
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Ace Your Next Interview with{" "}
              <span className="text-gradient">AI Coaching</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Practice with intelligent question generation, get real-time feedback, and track your progress — all powered by advanced AI.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-6">
                  Start Preparing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 border-border hover:bg-secondary"
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? "Hide Demo" : "Try Demo Interview"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo */}
      {showDemo && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="max-w-2xl mx-auto px-6 pb-16"
        >
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
              <Mic className="h-4 w-4 text-primary" /> Demo Interview Session
            </h3>
            <div className="space-y-4">
              {demoConversation.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.4 }}
                >
                  <ChatBubble message={msg.message} sender={msg.sender} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything You Need to Prepare</h2>
          <p className="text-muted-foreground">Comprehensive tools designed to maximize your interview success</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-xl p-6 transition-shadow hover:shadow-lg hover:border-primary/20"
            >
              <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span>PrepMind</span>
          </div>
          <p>AI-powered interview preparation platform</p>
        </div>
      </footer>
    </div>
  );
}
