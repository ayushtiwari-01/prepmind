import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, BarChart2, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { getPracticeHistory, type PracticeHistoryItem } from "@/services/ai-service";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { timeAgo } from "@/utils/timeFormatter";

export default function DashboardPage() {
  const { data, loading } = useAnalyticsData();
  const [history, setHistory] = useState<PracticeHistoryItem[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const h = await getPracticeHistory();
        setHistory(h);
      } catch (e) {
        console.error("Failed to load practice history:", e);
      }
    }
    loadHistory();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your interview preparation progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Interviews" value={data.totalInterviews} icon={BookOpen} />
        <StatCard title="Average Score" value={data.averageScore} icon={Target} score />
        <StatCard title="Topics Covered" value={data.topicPerformance.length} icon={BarChart2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Recent Interview Scores</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.recentInterviews}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="topic" stroke="hsl(0 0% 55%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)" }}
              />
              <Line type="monotone" dataKey="score" stroke="hsl(258 90% 66%)" strokeWidth={2} dot={{ fill: "hsl(258 90% 66%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4">Topic Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.topicPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="topic" stroke="hsl(0 0% 55%)" fontSize={11} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)" }}
              />
              <Bar dataKey="score" fill="hsl(258 90% 66%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Practice History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Practice History
          </h3>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.difficulty} • {timeAgo(item.date)}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  item.averageScore >= 8 ? "text-success" :
                  item.averageScore >= 6 ? "text-warning" : "text-destructive"
                }`}>
                  {item.averageScore.toFixed(1)}/10
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
