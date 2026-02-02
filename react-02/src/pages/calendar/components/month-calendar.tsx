import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState, useCallback, memo, useMemo } from "react";
import { message } from "antd";
import DaysDrawer from "./drawer";
import { v4 as uuidv4 } from "uuid";

interface MonthCalendarProps {
  value: Dayjs;
  events: Map<string, StoredEvent>;
  setEvents: React.Dispatch<React.SetStateAction<Map<string, StoredEvent>>>;
}

// 存储的事件数据结构
export interface StoredEvent {
  id: string;
  name: string;
  remarks: string;
  // YYYY-MM-DD 格式
  startDate: string;
  endDate: string;
}

export interface DayInfo {
  id: string;
  date: Dayjs;
  isToday?: boolean;
  isSlected: boolean;
  isCurrentMonth: boolean;
  // 单个事件
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
  onDoubleClick: (dayInfo: DayInfo) => void;
}

const DayItem = memo(function DayItem({
  dayInfo,
  onSelect,
  onDoubleClick,
}: DayItemProps) {
  // 直接将 dayInfo 传递给父组件，避免创建新闭包
  const handleClick = () => onSelect(dayInfo);
  const handleDoubleClick = () => onDoubleClick(dayInfo);

  // 根据事件位置生成样式
  const getEventClassNameForTodo = (todo: {
    position?: "start" | "middle" | "end" | "single";
  }) => {
    const baseClass =
      "event-item text-xs px-2 h-7 py-1 mt-1 rounded overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-7";

    switch (todo.position) {
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
        <div className={getEventClassNameForTodo(dayInfo.todo)}>
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

const applyEventsToDays = (
  days: DayInfo[],
  eventMap: Map<string, StoredEvent>,
  selectedDate: Dayjs | null,
): DayInfo[] => {
  return days.map((item, index) => {
    // 计算是否选中
    const isSelected =
      selectedDate != null && item.date.isSame(selectedDate, "day");

    // 查找包含当前日期的第一个事件
    let matchedEvent: {
      id: string;
      name: string;
      remarks: string;
      position?: "start" | "middle" | "end" | "single";
    } | null = null;

    for (const event of eventMap.values()) {
      const itemDate = item.date.format("YYYY-MM-DD");
      if (
        itemDate >= event.startDate &&
        itemDate <= event.endDate &&
        item.isCurrentMonth
      ) {
        const startDate = dayjs(event.startDate);
        const endDate = dayjs(event.endDate);
        const isFirstDay = item.date.isSame(startDate, "day");
        const isLastDay = item.date.isSame(endDate, "day");
        const isWeekEnd = index % 7 === 6;

        let position: "start" | "middle" | "end" | "single";

        if (isFirstDay && isLastDay) {
          position = "single";
        } else if (isFirstDay) {
          position = "start";
        } else if (isLastDay || isWeekEnd) {
          position = "end";
        } else {
          position = "middle";
        }

        matchedEvent = {
          id: event.id,
          name: event.name,
          remarks: event.remarks,
          position,
        };
        break;
      }
    }

    if (matchedEvent) {
      return {
        ...item,
        isSlected: isSelected,
        todo: matchedEvent,
      };
    }

    return { ...item, isSlected: isSelected, todo: undefined };
  });
};

function MonthCalendar(props: MonthCalendarProps) {
  const { value, events, setEvents } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateID, setDateID] = useState<string>("");
  // 保存被点击的日期，用于限制日期选择范围
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // 根据当前月份、事件和选中的日期，生成日历数据
  const allDays = useMemo(() => {
    const newDays = getAllDays(value);
    return applyEventsToDays(newDays, events, selectedDate);
  }, [events, selectedDate, value]);

  // 使用 useCallback 缓存 selectDay 函数，避免每次渲染都重新创建
  const selectDay = useCallback((dayInfo: DayInfo) => {
    setSelectedDate(dayInfo.date);
  }, []);

  // 使用 useCallback 缓存 handleDouble 函数
  const handleDouble = useCallback((dayInfo: DayInfo) => {
    // 如果该日期已有事件，不允许添加
    if (dayInfo.todo) {
      message.warning("该日期已有安排，无法再添加");
      return;
    }

    // 保存被点击的日期
    setSelectedDate(dayInfo.date);

    // 生成新的事件 ID
    const newEventId = uuidv4();
    setDrawerOpen(true);
    setDateID(newEventId);
  }, []);

  // 使用 useCallback 缓存 handleClose 函数
  const handleClose = useCallback(
    (val?: FormValues) => {
      setDrawerOpen(false);
      // 清空选中的日期
      setSelectedDate(null);

      if (val) {
        const [startDate, endDate] = val.date;

        // 保存事件到父组件的 events 状态
        const newEvent: StoredEvent = {
          id: val.id,
          name: val.name,
          remarks: val.remarks,
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        };

        setEvents((prevEvents) => {
          const newEvents = new Map(prevEvents);
          newEvents.set(val.id, newEvent);
          return newEvents;
        });
      }
    },
    [setEvents],
  );

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
      <DaysDrawer
        open={drawerOpen}
        onClose={handleClose}
        dateId={dateID}
        minDate={selectedDate}
      />
    </div>
  );
}

export default MonthCalendar;
