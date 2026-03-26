import OpenAI from "openai";
import type { ChatMessage, DocumentAnalysis } from "@/types/analysis";

export const maxDuration = 60;

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function buildContext(documentText: string, analysis?: Partial<DocumentAnalysis>): string {
  // Full document text available — use it directly
  if (documentText?.trim()) {
    return `Here is the full document content:\n---\n${documentText.slice(0, 32000)}\n---`;
  }

  // Fallback: reconstruct context from structured analysis
  if (analysis) {
    const lines: string[] = ["Here is the structured analysis of the document:"];

    if (analysis.summary) {
      lines.push(`\nSUMMARY:\n${analysis.summary}`);
    }
    if (analysis.keyPoints?.length) {
      lines.push("\nKEY POINTS:");
      analysis.keyPoints.forEach((kp) => lines.push(`- ${kp.title}: ${kp.detail}`));
    }
    if (analysis.risks?.length) {
      lines.push("\nRISKS & RED FLAGS:");
      analysis.risks.forEach((r) => lines.push(`- [${r.severity.toUpperCase()}] ${r.title}: ${r.body}`));
    }
    if (analysis.actions?.length) {
      lines.push("\nRECOMMENDED ACTIONS:");
      analysis.actions.forEach((a) => lines.push(`- ${a.text}`));
    }
    return lines.join("\n");
  }

  return "No document content is available.";
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const { message, documentText = "", analysis, history = [] } = (await req.json()) as {
      message: string;
      documentText?: string;
      analysis?: Partial<DocumentAnalysis>;
      history: ChatMessage[];
    };

    const context = buildContext(documentText, analysis);

    const systemPrompt = `You are a document assistant helping a user understand a specific document.

${context}

Answer questions about this document clearly and in plain language. Be specific — reference the actual content when relevant. Keep answers concise (2–4 sentences unless more detail is needed). If something is not covered, say so clearly.`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content ?? "";
    return Response.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat error:", message);
    return Response.json({ error: "Failed to get a response. Please try again.", detail: message }, { status: 500 });
  }
}
