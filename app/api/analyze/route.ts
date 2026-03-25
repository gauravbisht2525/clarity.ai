import Anthropic from "@anthropic-ai/sdk";
import * as pdfParse from "pdf-parse";
import type { DocumentAnalysis } from "@/types/analysis";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a document analysis assistant. Analyze the provided document and return a JSON object with exactly this structure:

{
  "summary": "2-3 sentence plain-language summary of what this document is about",
  "keyPoints": [
    { "id": "kp1", "title": "Short title (5-8 words)", "detail": "Full explanation of this clause or point in plain language. What does it mean for the user? (2-4 sentences)" }
  ],
  "risks": [
    { "id": "r1", "title": "Risk title (5-8 words)", "body": "What this risk means and why it matters to the user. What could go wrong? (2-3 sentences)", "severity": "high" }
  ],
  "actions": [
    { "id": "a1", "text": "Specific actionable step the user should take" }
  ]
}

Rules:
- Produce 3-6 key points, 2-5 risks, 3-5 actions
- severity must be exactly "high", "medium", or "low"
- Use plain language — no legal jargon
- Be specific to the actual document content
- Return ONLY valid JSON. No markdown code fences, no explanation outside the JSON.`;

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const fileName = (formData.get("fileName") as string) || "Document";

    let documentText = text || "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const parsed = await (pdfParse as unknown as (buf: Buffer) => Promise<{ text: string }>)(buffer);
        documentText = parsed.text;
      } else {
        documentText = buffer.toString("utf-8");
      }
    }

    if (!documentText.trim()) {
      return Response.json({ error: "No document content found" }, { status: 400 });
    }

    // Truncate to ~12k tokens to stay within context limits
    const truncated = documentText.slice(0, 48000);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this document:\n\n${truncated}`,
        },
      ],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: Omit<DocumentAnalysis, "documentText" | "fileName">;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Strip potential markdown fences if the model added them
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(clean);
    }

    const analysis: DocumentAnalysis = {
      ...parsed,
      documentText: truncated,
      fileName,
    };

    return Response.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    return Response.json(
      { error: "Failed to analyze document. Please try again." },
      { status: 500 }
    );
  }
}
