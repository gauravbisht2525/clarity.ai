export interface KeyPoint {
  id: string;
  title: string;
  detail: string;
}

export interface Risk {
  id: string;
  title: string;
  body: string;
  severity: "high" | "medium" | "low";
}

export interface Action {
  id: string;
  text: string;
}

export interface DocumentAnalysis {
  summary: string;
  keyPoints: KeyPoint[];
  risks: Risk[];
  actions: Action[];
  documentText: string;
  fileName?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
