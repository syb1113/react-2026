import type { Dayjs } from "dayjs";
import { useState } from "react";
import DaysDrawer from "./drawer";

interface MonthCalendarProps {
  value: Dayjs;
}

export interface DayInfo {
  id: number;
  date: Dayjs;
  isToday?: boolean;
  isSlected: boolean;
  isCurrentMonth: boolean;
}
const getAllDays = (_date: Dayjs) => {
  const startDate = _date.startOf("month");

  const day = startDate.day();

  const daysInfo: DayInfo[] = new Array(42);

  // 填充上个月的日期（前 day 个位置）
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      id:i,
      date: startDate.subtract(day - i, "day"),
      //不是本月的
      isSlected: false,
      isCurrentMonth: false,
    };
  }

  // 填充本月及下个月的日期（从索引 day 开始）
  for (let i = 0; i < daysInfo.length - day; i++) {
    const calcDate = startDate.add(i, "day");

    daysInfo[i + day] = {
      id:i + day,
      date: calcDate,
      isToday: calcDate.isSame(new Date(), "day"),
      isSlected: calcDate.isSame(_date, "day"),
      isCurrentMonth: calcDate.month() === _date.month(),
    };
  }
  return daysInfo;
};

function MonthCalendar(props: MonthCalendarProps) {
  const weekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  const [allDays, setAllDays] = useState(getAllDays(props.value));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectDay = (dayInfo: DayInfo) => {
    setAllDays(
      allDays.map((item) => {
        if (item.date.isSame(dayInfo.date)) {
          item.isSlected = true;
        } else {
          item.isSlected = false;
        }
        return item;
      })
    );
  };

  const handleDouble = () => {
    setDrawerOpen(true);  
  };

  const renderDay = (dayInfo: DayInfo) => {
    return (
      <div
        className={[
          "calendar-month-day-item flex-1 h-40 text-start p-2! border-t-2 border-t-gray-300",
          !dayInfo.isCurrentMonth && "text-gray-300",
          dayInfo.isToday && "border-t-blue-600!",
          dayInfo.isSlected && "bg-blue-100 text-blue-600",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => selectDay(dayInfo)}
        onDoubleClick={() => handleDouble()}
      >
        <div className="item-header flex justify-between">
          <span>{dayInfo.date.date()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-month w-full mt-4!">
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
      <div className="calendar-month-day-list w-full grid grid-cols-7 gap-x-2">
        {allDays.map((dayInfo) => renderDay(dayInfo))}
      </div>
      <DaysDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

export default MonthCalendar;
