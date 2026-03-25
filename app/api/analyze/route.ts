import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DocumentAnalysis } from "@/types/analysis";

// Vercel Hobby allows up to 60s
export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

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

const MOCK_ANALYSIS: Omit<DocumentAnalysis, "documentText" | "fileName"> = {
  summary:
    "This is a standard employment agreement between a company and a new hire. It covers compensation, responsibilities, confidentiality obligations, and terms of termination. You should review the non-compete and IP assignment clauses carefully before signing.",
  keyPoints: [
    {
      id: "kp1",
      title: "At-will employment with 2-week notice",
      detail:
        "Either party can terminate the agreement at any time without cause. However, you are expected to give 2 weeks' notice before leaving. The company may terminate immediately without notice in cases of misconduct.",
    },
    {
      id: "kp2",
      title: "Base salary of $95,000 paid bi-weekly",
      detail:
        "Your compensation is $95,000 per year, paid every two weeks. Salary reviews occur annually at the discretion of management. Bonuses are discretionary and not guaranteed.",
    },
    {
      id: "kp3",
      title: "All IP created belongs to the company",
      detail:
        "Any work product, inventions, or intellectual property you create during employment — even on personal time if related to the company's business — is automatically owned by the company. This is a broad clause that covers side projects.",
    },
    {
      id: "kp4",
      title: "12-month non-compete after leaving",
      detail:
        "For one year after leaving, you cannot work for direct competitors or start a competing business within the same industry and geographic region. Violating this clause could expose you to legal action.",
    },
    {
      id: "kp5",
      title: "Confidentiality obligations are indefinite",
      detail:
        "You must keep all company information confidential indefinitely — even after leaving. This includes customer lists, product plans, financials, and trade secrets.",
    },
  ],
  risks: [
    {
      id: "r1",
      title: "Overly broad IP assignment clause",
      body: "The IP assignment covers work done outside company hours if it is 'related to the company's business.' This is vague and could claim ownership over personal projects. You should negotiate a carve-out for pre-existing work and personal projects.",
      severity: "high",
    },
    {
      id: "r2",
      title: "Non-compete may limit future employment",
      body: "A 12-month non-compete in your industry is significant. Depending on your state, it may or may not be enforceable, but it could deter future employers. Consider negotiating the scope or duration.",
      severity: "high",
    },
    {
      id: "r3",
      title: "Bonus is fully discretionary",
      body: "The agreement mentions a bonus but explicitly states it is not guaranteed and can be changed or removed at any time. Do not factor this into your financial planning.",
      severity: "medium",
    },
    {
      id: "r4",
      title: "Arbitration clause waives jury trial rights",
      body: "Any disputes must go through private arbitration rather than court. This limits your ability to sue publicly and may favour the company in disputes.",
      severity: "medium",
    },
  ],
  actions: [
    {
      id: "a1",
      text: "Request a carve-out for pre-existing personal projects and side work unrelated to the company's core business.",
    },
    {
      id: "a2",
      text: "Negotiate the non-compete scope — try to narrow it to direct competitors only, or reduce the duration to 6 months.",
    },
    {
      id: "a3",
      text: "Ask for the bonus structure in writing, including any targets or criteria that determine payout.",
    },
    {
      id: "a4",
      text: "Consult a local employment attorney to verify the non-compete and IP clauses are enforceable in your state.",
    },
    {
      id: "a5",
      text: "Sign only after all negotiated changes are documented in a written amendment — verbal agreements are not binding.",
    },
  ],
};

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const fileName = (formData.get("fileName") as string) || "Document";

    // ── Mock mode ──────────────────────────────────────────
    if (process.env.MOCK_ANALYSIS === "true") {
      await new Promise((r) => setTimeout(r, 3000));
      return Response.json({
        ...MOCK_ANALYSIS,
        documentText: text ?? "Mock document content.",
        fileName,
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    let result;
    let rawDocumentText = text?.slice(0, 48000) ?? "";
    let isPDFUpload = false;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (isPDF) {
        isPDFUpload = true;
        // Send the PDF directly to Gemini as base64 — no parsing library needed.
        // Gemini natively understands PDF structure, layout, and text.
        result = await model.generateContent([
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: "application/pdf",
            },
          },
          "Analyze this document and return the structured JSON as instructed.",
        ]);
      } else {
        rawDocumentText = buffer.toString("utf-8").slice(0, 48000);
        if (!rawDocumentText.trim()) {
          return Response.json({ error: "No document content found" }, { status: 400 });
        }
        result = await model.generateContent(`Analyze this document:\n\n${rawDocumentText}`);
      }
    } else if (rawDocumentText.trim()) {
      result = await model.generateContent(`Analyze this document:\n\n${rawDocumentText}`);
    } else {
      return Response.json({ error: "No document content found" }, { status: 400 });
    }

    const raw = result.response.text();

    let parsed: Omit<DocumentAnalysis, "documentText" | "fileName">;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Strip potential markdown fences if the model added them
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(clean);
    }

    // Build chat context. For PDFs we don't have raw text, so construct a
    // rich readable summary from the analysis so follow-up Q&A still works.
    const documentText = isPDFUpload
      ? [
          `Document: ${fileName}`,
          "",
          `Summary: ${parsed.summary}`,
          "",
          "Key Points:",
          ...parsed.keyPoints.map((kp) => `- ${kp.title}: ${kp.detail}`),
          "",
          "Risks:",
          ...parsed.risks.map((r) => `- [${r.severity.toUpperCase()}] ${r.title}: ${r.body}`),
          "",
          "Recommended Actions:",
          ...parsed.actions.map((a) => `- ${a.text}`),
        ].join("\n")
      : rawDocumentText;

    const analysis: DocumentAnalysis = {
      ...parsed,
      documentText,
      fileName,
    };

    return Response.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Analyze error:", message);
    return Response.json(
      { error: "Failed to analyze document. Please try again.", detail: message },
      { status: 500 }
    );
  }
}
