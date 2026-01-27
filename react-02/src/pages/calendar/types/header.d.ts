export interface YearItem {
  value: number;
  label: string;
  isCurrent?: boolean;
}

export interface MonthItem {
  value: number;
  label: string;
  isCurrent?: boolean;
}

export interface DateRange {
  startYear: number;
  endYear: number;
  years: YearItem[];
  months: MonthItem[];
}