import { tool } from "ai";
import { z } from "zod";
import { getTopBeatsPlays, getTrafficData } from "./analytics-api-server";

export const umbrellaTools = {
  getTrafficData: tool({
    description:
      "Fetches website traffic. Use this for visits, daily stats, and trends over time.",
    parameters: z.object({
      days: z
        .number()
        .default(30)
        .describe("Lookback period. 'today' = 1, 'last 3 days' = 3."),
      // AI si může vybrat preferovaný styl zobrazení
      visualHint: z
        .enum(["area-chart", "bar-chart", "line-chart"])
        .default("area-chart")
        .describe("The best visual representation for the traffic trend."),
    }),
    execute: async ({ days = 30, visualHint }) => {
      console.log(
        `🛠 AI calling getTrafficData | period: ${days} days | hint: ${visualHint}`,
      );
      const data = await getTrafficData(days);

      // Vracíme objekt s daty i hintem
      return {
        data,
        visualHint,
      };
    },
  }),

  getTopBeats: tool({
    description:
      "Returns a leaderboard of the most played beats. Use limit 1 for 'the most played'.",
    parameters: z.object({
      limit: z.number().default(5).describe("Number of items to return."),
      visualHint: z
        .enum(["bar-chart", "leaderboard-list", "pie-chart"])
        .default("leaderboard-list")
        .describe("The best visual representation for the rankings."),
    }),
    execute: async ({ limit = 5, visualHint }) => {
      console.log(
        `🛠 AI calling getTopBeats | limit: ${limit} | hint: ${visualHint}`,
      );
      const data = await getTopBeatsPlays(limit);

      return {
        data,
        visualHint,
      };
    },
  }),
};
