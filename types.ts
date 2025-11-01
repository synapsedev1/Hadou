export interface ReflectionEntry {
  id?: number;
  user_id?: string;
  date: string;
  total_score: number;
  note: string;
}

export interface Profile {
  id: string;
  updated_at: string;
  username: string;
}