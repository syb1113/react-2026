import "./styles/index.scss";
import type { StoredEvent } from "./components/month-calendar";
import MonthCalendar from "./components/month-calendar";
import Header from "./components/header";
import dayjs from "dayjs";
import { useState, useCallback } from "react";

function Calendar() {
  const [date, setDate] = useState(dayjs());
  // 将事件状态提升到父组件，避免切换月份时丢失
  const [events, setEvents] = useState<Map<string, StoredEvent>>(new Map());

  // 使用 useCallback 缓存事件处理函数（rerender-memo）
  const handleToday = useCallback((value: string) => {
    setDate(dayjs(value));
  }, []);

  return (
    <div className="calendar bg-white p-4!">
      <Header value={date} toady={handleToday} />
      <MonthCalendar value={date} events={events} setEvents={setEvents} />
    </div>
  );
}

export default Calendar;
