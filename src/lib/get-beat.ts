export function getDaysSinceUpload(date: string | Date): string {
  const uploadDate = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - uploadDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}