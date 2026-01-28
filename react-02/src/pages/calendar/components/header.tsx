import { Select, Button } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
interface HeaderProps {
  value: Dayjs;
  toady: (value:string) => void;
}

const getDateRange = (date: Dayjs): DateRange =>{
  // 解析输入日期，默认为当前日期
  const baseDate = date ;
  
  const currentYear = baseDate.year();
  const currentMonth = baseDate.month() + 1;
  
  // 获取15年的年份范围
  const startYear = currentYear - 7;
  const endYear = currentYear + 7;
  
  // 生成年份数组
  const years: YearItem[] = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => {
      const year = startYear + index;
      return {
        value: year,
        label: `${year}年`,
        isCurrent: year === currentYear,
      };
    }
  );
  
  // 生成月份数组
  const months: MonthItem[] = Array.from(
    { length: 12 },
    (_, index) => {
      const month = index + 1;
      return {
        value: month,
        label: `${month}月`,
        isCurrent: month === currentMonth,
      };
    }
  );
  
  return {
    startYear,
    endYear,
    years,
    months,
  };
}
function Header(props:HeaderProps) {
  const { value, toady } = props;

  const date = dayjs();

  const { years, months } = getDateRange(date);

  const handleChangeYear = (year: number) => {
    const next = value.year(year);
    const safYear = Math.min(value.date(), next.daysInMonth());
    toady(next.date(safYear).format("YYYY-MM-DD"));
  };
  const handleChangeMonth = (month: number) => {
    const next = value.month(month - 1);
    const safeDay = Math.min(value.date(), next.daysInMonth());
    toady(next.date(safeDay).format("YYYY-MM-DD"));
  };

  const handleToday = () => {
    toady(dayjs().format("YYYY-MM-DD"));
  };

  return (
    <div className="calendar-month-header flex gap-2 justify-end">
      <Select
        value={value.year()}
        style={{ width: 120 }}
        options={years}
        onChange={(v) => handleChangeYear(v)}
      />
      <Select
        value={value.month() + 1}
        style={{ width: 120 }}
        onChange={(v) => handleChangeMonth(v)}
        options={months}
      />
      <Button onClick={handleToday}>今天</Button>
    </div>
  );
}

export default Header;
