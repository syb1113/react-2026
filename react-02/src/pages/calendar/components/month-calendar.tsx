import type { Dayjs } from "dayjs";

interface MonthCalendarProps {
  value: Dayjs;
}

export interface DayInfo {
  date: Dayjs;
  isCurrentMonth: boolean;
}
const getAllDays = (_date: Dayjs) => {
  const startDate = _date.startOf("month");

  const day = startDate.day();

  const daysInfo: DayInfo[] = new Array(42);

  // 填充上个月的日期（前 day 个位置）
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, "day"),
      //不是本月的
      isCurrentMonth: false,
    };
  }

  // 填充本月及下个月的日期（从索引 day 开始）
  for (let i = 0; i < daysInfo.length - day; i++) {
    const calcDate = startDate.add(i, "day");

    daysInfo[i + day] = {
      date: calcDate,
      isCurrentMonth: calcDate.month() === _date.month(),
    };
  }
  return daysInfo;
};

const renderDay = (dayInfo: DayInfo) => {
  return (
    <div
      className={[
        "calendar-month-day-item flex-1 h-40 text-end p-2 border-t-2 border-t-gray-300",
        !dayInfo.isCurrentMonth && "text-gray-300",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{dayInfo.date.date()}</span>
    </div>
  );
};

function MonthCalendar(props: MonthCalendarProps) {
  const weekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  const allDays = getAllDays(props.value);

  return (
    <div className="calendar-month w-full">
      <div className="calendar-month-week-list w-full flex gap-2">
        {weekList.map((item) => (
          <div
            className="calendar-month-week-item flex-1 h-10 text-end p-2"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="calendar-month-day-list w-full grid grid-cols-7 gap-2">
        {allDays.map((dayInfo) => renderDay(dayInfo))}
      </div>
    </div>
  );
}

export default MonthCalendar;
