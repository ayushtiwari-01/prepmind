import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, User, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const API_BASE = "https://prepmind-backend-o10j.onrender.com/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export default function SettingsPage() {
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    difficulty: "Medium",
    dailyGoal: 5,
    notifications: true,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Load user data from backend on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setSettings({
            name: data.name || "",
            email: data.email || "",
            difficulty: data.defaultDifficulty || "Medium",
            dailyGoal: data.dailyGoal ?? 5,
            notifications: true,
          });
        }
      } catch (e) {
        console.error("Failed to load user settings:", e);
        // Fall back to context user data
        if (user) {
          setSettings(prev => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
          }));
        }
      }
      setLoadingSettings(false);
    }
    loadUser();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/auth/settings`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: settings.name,
          email: settings.email,
          difficulty: settings.difficulty,
          dailyGoal: settings.dailyGoal
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save settings");
      }

      const data = await res.json();

      // Update localStorage with new user info
      const authUser = { id: data.user.id, name: data.user.name, email: data.user.email };
      localStorage.setItem("authUser", JSON.stringify(authUser));

      toast.success("Settings saved successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save settings.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password.";
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{settings.name}</h2>
            <p className="text-sm text-muted-foreground">{settings.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="bg-secondary border-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Default Difficulty</label>
              <Select value={settings.difficulty} onValueChange={(v) => setSettings({ ...settings, difficulty: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Daily Goal (questions)</label>
              <Input type="number" value={settings.dailyGoal} onChange={(e) => setSettings({ ...settings, dailyGoal: Number(e.target.value) })} className="bg-secondary border-border" />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive daily practice reminders</p>
            </div>
            <Switch checked={settings.notifications} onCheckedChange={(v) => setSettings({ ...settings, notifications: v })} />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Change Password</h2>
            <p className="text-xs text-muted-foreground">Update your account password</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Current Password</label>
            <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="Enter current password" className="bg-secondary border-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">New Password</label>
              <Input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} placeholder="Enter new password" className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirm New Password</label>
              <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Confirm new password" className="bg-secondary border-border" />
            </div>
          </div>
        </div>

        <Button onClick={handleChangePassword} disabled={changingPassword} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {changingPassword ? "Changing..." : "Change Password"}
        </Button>
      </motion.div>
    </div>
  );
}
