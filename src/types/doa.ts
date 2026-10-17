export interface DoaItem {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  fawaid?: string;
  repeatCount?: number;
  category: 'pagi' | 'petang' | 'shalat' | 'harian';
}

export interface TasbihHistory {
  id: string;
  title: string;
  count: number;
  date: string;
}
