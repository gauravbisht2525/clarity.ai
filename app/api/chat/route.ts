import OpenAI from "openai";
import type { ChatMessage } from "@/types/analysis";

// Vercel Hobby allows up to 60s
export const maxDuration = 60;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { message, documentText, history = [] } = (await req.json()) as {
      message: string;
      documentText: string;
      history: ChatMessage[];
    };

    const systemPrompt = `You are a document assistant helping a user understand a specific document they uploaded.

Here is the document content:
---
${documentText.slice(0, 32000)}
---

Answer questions about this document clearly and in plain language. Be specific — reference the actual document content when relevant. Keep answers concise (2-4 sentences unless more detail is needed). If something is not covered in the document, say so clearly.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content ?? "";
    return Response.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat error:", message);
    return Response.json(
      { error: "Failed to get a response. Please try again.", detail: message },
      { status: 500 }
    );
  }
}
