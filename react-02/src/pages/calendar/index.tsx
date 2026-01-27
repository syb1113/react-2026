import './styles/index.scss'
import MonthCalendar from './components/month-calendar';
import Header from './components/header';
import dayjs from "dayjs"

function Calendar() {
  const date = dayjs('2026-01-27')

  return (
    <div className="calendar bg-white p-4!">
      <Header />
      <MonthCalendar value={date} />
    </div>
  )
}

export default Calendar