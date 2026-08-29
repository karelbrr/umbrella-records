import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { umbrellaTools } from "@/lib/ai-tools";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      // @ts-ignore
      maxSteps: 5,
      system: `You are the Lead Data Analyst for Umbrella Records. Respond in English.

OPERATIONAL RULES:
1. TOOLS: Use 'getTrafficData' for visits/stats and 'getTopBeats' for music rankings.
2. PARAMETERS: You are a "Parameter Hunter." Extract numbers for 'days' (timeframe) and 'limit' (quantity).

4. DEFAULTS: If no number is mentioned, use days: 30 / limit: 5.
5. OUTPUT: Summarize results in a friendly, conversational analytical tone. If empty, state: "I couldn't find any records for that period.

EXAMPLES (Follow this logic):
- User: "traffic za 3 dny" -> getTrafficData(days: 3)
- User: "traffic za 23 dny" -> getTrafficData(days: 23)
- User: "ukaž mi top 2 beaty" -> getTopBeats(limit: 2)
- User: "nejhranější skladba" -> getTopBeats(limit: 1)
`,

      messages,
      tools: umbrellaTools,
    });

    return Response.json({
      text: result.text,
      toolResults: result.toolResults,
    });
  } catch (error: any) {
    console.error("❌ API ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
