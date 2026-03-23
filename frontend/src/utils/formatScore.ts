export function formatScore(score: number): string {
  return `${Math.round(score)}/10`;
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-success";
  if (score >= 6) return "text-warning";
  return "text-destructive";
}

export function getScoreBg(score: number): string {
  if (score >= 8) return "bg-success/10 text-success";
  if (score >= 6) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

