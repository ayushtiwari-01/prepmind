import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const { isAuthenticated, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleDemo = () => {
    enterDemoMode();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(258_90%_66%/0.08),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">PrepMind</span>
          </div>
          <p className="text-sm text-muted-foreground">AI-powered interview preparation</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSwitchToSignup={() => setTab("signup")} />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSwitchToLogin={() => setTab("login")} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2" onClick={handleDemo}>
            <Sparkles className="h-3.5 w-3.5" />
            Try Demo Mode
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
