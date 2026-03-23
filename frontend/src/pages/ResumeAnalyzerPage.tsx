import { useState } from "react"
import { analyzeResume } from "@/services/ai-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ResumeAnalysis } from "@/types"

export default function ResumeAnalyzerPage() {

  const [result, setResult] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState("Software Engineer")

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]

    if (!file) return

    setError(null)
    setLoading(true)

    try {

      const res = await analyzeResume(file, role)

      setResult(res)

    } catch (err: any) {

      setError(err?.message || "Failed to analyze resume. Please try again.")
      setResult(null)

    } finally {

      setLoading(false)

    }

  }

  return (
    <div className="space-y-4">

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Target Role
        </label>
        <Input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Frontend Engineer"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Upload Resume
        </label>
        <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium cursor-pointer transition-colors">
          Choose PDF
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground">
          Analyzing...
        </p>
      )}

      {result && (

        <div className="space-y-4">
          {(() => {
            const raw = result.score ?? 0
            const normalized = raw > 10 ? raw / 10 : raw
            const display = Number.isFinite(normalized)
              ? normalized.toFixed(1).replace(/\.0$/, "")
              : "0"

            return (
              <div className="border rounded p-3 space-y-1 text-sm">
                <p className="font-semibold">
                  Target Role: <span className="font-normal">{result.role}</span>
                </p>
                <p className="font-semibold">
                  Role Fit Score: <span className="font-normal">{display}/10</span>
                </p>
              </div>
            )
          })()}

          <p className="text-sm text-muted-foreground">
            This score reflects how well your resume fits the selected target role, not how strong it is in general.
          </p>

          {result.weaknesses.some((w) =>
            /lack of direct experience|no relevant certifications|no mention of experience/i.test(w)
          ) && (
              <p className="text-sm text-yellow-500">
                Your resume appears focused on a different domain than the target role. Consider tailoring it to highlight more relevant experience, skills, and certifications.
              </p>
            )}

          <div className="border rounded p-3 space-y-1 text-sm">
            <h3 className="font-semibold">Strengths</h3>
            <ul className="list-disc list-inside">
              {result.strengths.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="border rounded p-3 space-y-1 text-sm">
            <h3 className="font-semibold">Weaknesses</h3>
            <ul className="list-disc list-inside">
              {result.weaknesses.map((w: string, i: number) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          {result.missingSkills && result.missingSkills.length > 0 && (
            <div className="border rounded p-3 space-y-1 text-sm">
              <h3 className="font-semibold">Missing Skills</h3>
              <ul className="list-disc list-inside">
                {result.missingSkills.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <div className="border rounded p-3 space-y-1 text-sm">
              <h3 className="font-semibold">Suggestions</h3>
              <ul className="list-disc list-inside">
                {result.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      )}

    </div>
  )
}