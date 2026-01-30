import type { Dayjs } from "dayjs";
import { useState, useCallback, memo } from "react";
import DaysDrawer from "./drawer";
import { v4 as uuidv4 } from "uuid";

interface MonthCalendarProps {
  value: Dayjs;
}

export interface DayInfo {
  id: string;
  date: Dayjs;
  isToday?: boolean;
  isSlected: boolean;
  isCurrentMonth: boolean;
  todo?: {
    id: string;
    name: string;
    remarks: string;
    // 标记事件在范围中的位置
    position?: "start" | "middle" | "end" | "single";
  };
}

interface FormValues {
  id: string;
  name: string;
  date: Dayjs[];
  remarks: string;
}

// 避免每次渲染都重新创建
const WEEK_LIST = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface DayItemProps {
  dayInfo: DayInfo;
  onSelect: (dayInfo: DayInfo) => void;
  onDoubleClick: (id: string) => void;
}

const DayItem = memo(function DayItem({
  dayInfo,
  onSelect,
  onDoubleClick,
}: DayItemProps) {
  // 直接将 dayInfo 传递给父组件，避免创建新闭包
  const handleClick = () => onSelect(dayInfo);
  const handleDoubleClick = () => onDoubleClick(dayInfo.id);

  // 根据事件位置生成样式
  const getEventClassName = () => {
    if (!dayInfo.todo) return "";

    const baseClass =
      "event-item text-xs px-2 h-8 py-1 mt-1 rounded overflow-hidden text-ellipsis whitespace-nowrap text-[16px] leading-8";

    switch (dayInfo.todo.position) {
      case "start":
        return `${baseClass} rounded-r-none event-start`;
      case "end":
        return `${baseClass} rounded-l-none event-end`;
      case "middle":
        return `${baseClass} rounded-l-none rounded-r-none event-middle`;
      case "single":
      default:
        return `${baseClass} event-single`;
    }
  };

  return (
    <div
      className={[
        "calendar-month-day-item flex-1 h-40 text-start border-t-2 p-2! border-t-gray-300",
        !dayInfo.isCurrentMonth && "text-gray-300",
        dayInfo.isToday && "border-t-blue-600!",
        dayInfo.isSlected && "bg-blue-100 text-blue-600",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div className="item-header flex justify-between">
        <span>{dayInfo.date.date()}</span>
      </div>
      {/* 渲染事件 */}
      {dayInfo.todo && (
        <div className={getEventClassName()}>
          {dayInfo.todo.position === "start" && dayInfo.todo.name}
        </div>
      )}
    </div>
  );
});
const getAllDays = (_date: Dayjs) => {
  const startDate = _date.startOf("month");

  const day = startDate.day();

  const daysInfo: DayInfo[] = new Array(42);

  // 填充上个月的日期（前 day 个位置）
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      id: uuidv4(),
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
      id: uuidv4(),
      date: calcDate,
      isToday: calcDate.isSame(new Date(), "day"),
      isSlected: calcDate.isSame(_date, "day"),
      isCurrentMonth: calcDate.month() === _date.month(),
    };
  }
  return daysInfo;
};

function MonthCalendar(props: MonthCalendarProps) {
  const [allDays, setAllDays] = useState(getAllDays(props.value));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateID, setDateID] = useState<string>("");

  // 使用 useCallback 缓存 selectDay 函数，避免每次渲染都重新创建
  const selectDay = useCallback((dayInfo: DayInfo) => {
    setAllDays((prevDays) =>
      prevDays.map((item) => ({
        ...item,
        isSlected: item.date.isSame(dayInfo.date),
      })),
    );
  }, []);

  // 使用 useCallback 缓存 handleDouble 函数
  const handleDouble = useCallback((id: string) => {
    setDrawerOpen(true);
    setDateID(id);
  }, []);

  // 使用 useCallback 缓存 handleClose 函数
  const handleClose = useCallback((val?: FormValues) => {
    setDrawerOpen(false);
    if (val) {
      const [startDate, endDate] = val.date;

      setAllDays((prevDays) =>
        prevDays.map((item, index) => {
          const inRange =
            item.date.isSame(startDate, "day") ||
            item.date.isSame(endDate, "day") ||
            (item.date.isAfter(startDate, "day") &&
              item.date.isBefore(endDate, "day"));

          if (inRange && item.isCurrentMonth) {
            // 判断事件在当前日期的位置
            let position: "start" | "middle" | "end" | "single";

            const isFirstDay = item.date.isSame(startDate, "day");
            const isLastDay = item.date.isSame(endDate, "day");
            const isWeekEnd = index % 7 === 6; // 每周六

            // 单日事件
            if (isFirstDay && isLastDay) {
              position = "single";
            }
            // 事件第一天或每周的第一天
            else if (isFirstDay) {
              position = "start";
            }
            // 事件最后一天或每周的最后一天
            else if (isLastDay || isWeekEnd) {
              position = "end";
            }
            // 中间日期
            else {
              position = "middle";
            }

            return {
              ...item,
              todo: {
                id: val.id,
                name: val.name,
                remarks: val.remarks,
                position,
              },
            };
          }

          return item;
        }),
      );
    }
  }, []);

  return (
    <div className="calendar-month w-full mt-4!">
      <div className="calendar-month-week-list w-full flex gap-2">
        {WEEK_LIST.map((item) => (
          <div
            className="calendar-month-week-item flex-1 h-10 text-end p-2"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="calendar-month-day-list w-full grid grid-cols-7">
        {allDays.map((dayInfo) => (
          <DayItem
            key={dayInfo.date.format("YYYY-MM-DD")}
            dayInfo={dayInfo}
            onSelect={selectDay}
            onDoubleClick={handleDouble}
          />
        ))}
      </div>
      <DaysDrawer open={drawerOpen} onClose={handleClose} dateId={dateID} />
    </div>
  );
}

export default MonthCalendar;
