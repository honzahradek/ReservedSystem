// UI only, calendar view begins from today, back , next (onNavigate, onView)
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import cs from "date-fns/locale/cs";
import CalendarEvent from "./CalendarEvent";
import { getEventStyle } from "@/components/ReservationCalendar/utils/statusEventStyles";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const calendarFormats = {
  /* For czech tiíme and description
    ------------------------ 
  
  timeGutterFormat: 'HH:mm',

  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, 'HH:mm')} – ${localizer.format(end, 'HH:mm')}`,

  agendaTimeFormat: 'HH:mm',

  dayHeaderFormat: (date, culture, localizer) =>
    localizer.format(date, 'EEEE d.M.yyyy'),

  dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, 'd.M.yyyy')} – ${localizer.format(end, 'd.M.yyyy')}`,
*/}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { cs },
});

const DnDCalendar = withDragAndDrop(Calendar);

const CalendarView = ({
  events,
  view,
  date,
  onViewChange,
  onNavigate,
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  onEventResize,
}) => (
  <DnDCalendar
    localizer={localizer}
    //formats={calendarFormats}
    //culture="cs"
    events={events}
    selectable
    resizable
    startAccessor="start"
    endAccessor="end"
    view={view}
    onView={onViewChange}
    date={date}
    onNavigate={onNavigate}
    views={["month", "week", "day"]}
    onSelectSlot={onSelectSlot}
    onSelectEvent={onSelectEvent}
    onEventDrop={onEventDrop}
    onEventResize={onEventResize}
    components={{ event: CalendarEvent }}
    eventPropGetter={getEventStyle}
    style={{ height: 500 }}
  />
);

export default CalendarView;