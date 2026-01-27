import { Select } from "antd";
import type { Dayjs } from "dayjs";
interface HeaderProps {
  value: Dayjs;
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
  const { value } = props;

  const { years, months } = getDateRange(value);

  return (
    <div className="calendar-month-header flex gap-2 justify-end">
      <Select
        defaultValue={years.find((item) => item.isCurrent)?.value}
        style={{ width: 120 }}
        options={years}
      />
      <Select
        defaultValue={months.find((item) => item.isCurrent)?.value}
        style={{ width: 120 }}
        options={months}
      />
    </div>
  );
}

export default Header;
