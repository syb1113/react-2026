import "./styles/index.scss";
import MonthCalendar from "./components/month-calendar";
import Header from "./components/header";
import dayjs from "dayjs";
import { useState, useCallback } from "react";

function Calendar() {
  const [date, setDate] = useState(dayjs());

  // 使用 useCallback 缓存事件处理函数（rerender-memo）
  const handleToday = useCallback((value: string) => {
    setDate(dayjs(value));
  }, []);

  return (
    <div className="calendar bg-white p-4!">
      <Header value={date} toady={handleToday} />
      <MonthCalendar key={date.format("YYYY-MM-DD")} value={date} />
    </div>
  );
}

export default Calendar;