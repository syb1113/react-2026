// 让日历模块的类型变成“全局可见”，从而在任意文件中无需 import 就能直接使用 YearItem/MonthItem/DateRange。
// 注意：全局类型会污染全项目命名空间；若项目变大，更推荐使用显式 import。

declare global {
  interface YearItem {
    value: number;
    label: string;
    isCurrent?: boolean;
  }

  interface MonthItem {
    value: number;
    label: string;
    isCurrent?: boolean;
  }

  interface DateRange {
    startYear: number;
    endYear: number;
    years: YearItem[];
    months: MonthItem[];
  }
}

export {};


