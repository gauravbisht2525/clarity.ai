import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "@/types/analysis";

// Vercel Hobby allows up to 60s
export const maxDuration = 60;

const client = new Anthropic();

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
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

    const messages = [
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    return Response.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return Response.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
