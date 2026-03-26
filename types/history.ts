import type { KeyPoint, Risk, Action } from "@/types/analysis";

export interface HistoryEntry {
  id: string;
  file_name: string;
  summary: string;
  key_points: KeyPoint[];
  risks: Risk[];
  actions: Action[];
  created_at: string;
}
