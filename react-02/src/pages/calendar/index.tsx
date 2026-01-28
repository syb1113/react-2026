import './styles/index.scss'
import MonthCalendar from './components/month-calendar';
import Header from './components/header';
import dayjs from "dayjs"
import { useState } from 'react';

function Calendar() {
  const [date, setDate] = useState(dayjs('2026-01-27'))

  const handleToday = (value: string) => {
    setDate(dayjs(value))
  };

  return (
    <div className="calendar bg-white p-4!">
      <Header value={date} toady={handleToday}/>
      <MonthCalendar key={date.format("YYYY-MM-DD")} value={date}/>
    </div>
  )
}

export default Calendar