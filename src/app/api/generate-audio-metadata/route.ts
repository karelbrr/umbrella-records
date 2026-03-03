
import { generateObject } from "ai";
import { z } from "zod";

import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY, 
});

export async function POST(req: Request) {

  console.log("DEBUG: Délka klíče je:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || "0 (CHYBÍ!)");
  try {
    const { audioUrl } = await req.json();

    if (!audioUrl) {
      return Response.json(
        { success: false, error: "Missing audioUrl parameter" },
        { status: 400 },
      );
    }

    console.log("🤖 Sending audio URL directly to Gemini 2.5 Flash...");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system: `You are a professional music analyst. Analyze the provided audio with extreme precision.
        
      CRITICAL INSTRUCTIONS:
      1. BPM: Count the beats carefully. Do not just guess based on the genre.
      2. KEY: Analyze the harmonic content to identify the correct musical key.
      3. GENRE: Identify the sub-genre precisely.

      If the audio is a 'trap beat' (as the filename suggests), look for high-hat rolls and heavy 808s which usually put the BPM in the 130-160 range (or 65-80 half-time).`,
      schema: z.object({
        name: z
          .string()
          .describe("Name of the track. max 5 words, no special characters."),
        bpm: z.number().describe("BPM (tempo) of the track."),
        key: z.string().describe("Musical key (e.g., C minor, G# Major)."),
        genre: z.enum(["trap", "synthwave", "edm"]),
        description: z
          .string()
          .describe(
            "A short, catchy description of the track's mood (max 4 sentences).",
          ),
      }),
      messages: [
        {
          role: "user",

          content: `Please analyze the audio available at the following URL:\n\n${audioUrl}\n\nRespond with a JSON object that matches the provided schema (bpm, key, genre, description). Return only the JSON object.`,
        },
      ],
    });

    console.log("✅ Analysis successful!");

    return Response.json({
      success: true,
      aiMetadata: object,
    });
  } catch (error) {
    console.error("❌ Oops, an error occurred:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
