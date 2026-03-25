import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/types/analysis";

// Vercel Hobby allows up to 60s
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { message, documentText, history = [] } = (await req.json()) as {
      message: string;
      documentText: string;
      history: ChatMessage[];
    };

    const systemInstruction = `You are a document assistant helping a user understand a specific document they uploaded.

Here is the document content:
---
${documentText.slice(0, 32000)}
---

Answer questions about this document clearly and in plain language. Be specific — reference the actual document content when relevant. Keep answers concise (2-4 sentences unless more detail is needed). If something is not covered in the document, say so clearly.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
    });

    // Map history to Gemini format
    const chatHistory = history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return Response.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat error:", message);
    return Response.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
