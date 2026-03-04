// Generate 30 days of realistic traffic data
function generateTrafficData() {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    const baseViews = 800 + Math.floor(Math.random() * 600)
    const baseVisits = 400 + Math.floor(Math.random() * 400)
    // Weekend dip
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const weekendMultiplier = isWeekend ? 0.65 : 1
    data.push({
      date: dayLabel,
      beatViews: Math.floor(baseViews * weekendMultiplier),
      pageVisits: Math.floor(baseVisits * weekendMultiplier),
    })
  }
  return data
}

export const trafficData = generateTrafficData()

export const topBeats = [
  { name: "Midnight Drip", plays: 4820, producer: "ProdByNova" },
  { name: "Neon Dreams", plays: 3940, producer: "808Wizard" },
  { name: "Trap Symphony", plays: 3210, producer: "BeatKing" },
  { name: "Lo-Fi Sunset", plays: 2870, producer: "ChillWave" },
  { name: "Dark Matter", plays: 2340, producer: "ShadowBeats" },
]

export const recentActivity = [
  {
    id: 1,
    beat: "Midnight Drip",
    user: "Marcus J.",
    action: "purchased" as const,
    amount: "$29.99",
    time: "2 min ago",
    initials: "MJ",
  },
  {
    id: 2,
    beat: "Neon Dreams",
    user: "Sarah K.",
    action: "viewed" as const,
    amount: null,
    time: "5 min ago",
    initials: "SK",
  },
  {
    id: 3,
    beat: "Trap Symphony",
    user: "DJ Phoenix",
    action: "purchased" as const,
    amount: "$49.99",
    time: "12 min ago",
    initials: "DP",
  },
  {
    id: 4,
    beat: "Lo-Fi Sunset",
    user: "Beat Maker X",
    action: "viewed" as const,
    amount: null,
    time: "18 min ago",
    initials: "BM",
  },
  {
    id: 5,
    beat: "Dark Matter",
    user: "Alex R.",
    action: "purchased" as const,
    amount: "$34.99",
    time: "25 min ago",
    initials: "AR",
  },
  {
    id: 6,
    beat: "Neon Dreams",
    user: "Tyler C.",
    action: "viewed" as const,
    amount: null,
    time: "32 min ago",
    initials: "TC",
  },
  {
    id: 7,
    beat: "Midnight Drip",
    user: "Luna V.",
    action: "purchased" as const,
    amount: "$29.99",
    time: "45 min ago",
    initials: "LV",
  },
  {
    id: 8,
    beat: "Trap Symphony",
    user: "Chris B.",
    action: "viewed" as const,
    amount: null,
    time: "1 hr ago",
    initials: "CB",
  },
]
