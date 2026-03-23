export interface Question {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  category: string;
  tags: string[];
}

export interface Answer {
  questionId: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewSession {
  id: string;
  topic: string;
  questions: Question[];
  answers: Answer[];
  overallScore: number;
  startedAt: string;
  completedAt?: string;
  status: "in-progress" | "completed";
}

export interface ResumeAnalysis {
  role: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
}

export interface AnalyticsData {
  totalInterviews: number;
  averageScore: number; // percentage 0-100
  performanceByDifficulty: { difficulty: string; score: number }[];
  topicPerformance: { topic: string; score: number }[];
  recentInterviews: { topic: string; difficulty: string; score: number }[];
}

export interface UserSettings {
  name: string;
  email: string;
  preferredTopics: string[];
  difficulty: "easy" | "medium" | "hard";
  dailyGoal: number;
  notifications: boolean;
}
