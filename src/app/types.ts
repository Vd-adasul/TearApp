export interface Segment {
  id: number;
  task: string;
  torn: boolean;
  tornAt: number | null;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  totalHours: number;
  segments: Segment[];
}

export interface AppData {
  today: DayRecord | null;
  history: DayRecord[];
  streak: number;
  motivationPhoto: string | null;
  lastQuoteIndex: number;
}
