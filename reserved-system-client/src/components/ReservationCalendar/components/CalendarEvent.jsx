//Representing one event in the calendar
import { FiClock, FiCheck, FiX } from "react-icons/fi";

const icons = {
  PENDING: <FiClock />,
  CONFIRMED: <FiCheck />,
  CANCELLED: <FiX />,
};

const CalendarEvent = ({ event }) => {
  const tooltip = `
    ${event.user?.username}
    ${event.status}
    ${new Date(event.start).toLocaleString()} – ${new Date(event.end).toLocaleString()}
    `.trim();
  
  
  return (
    <div title={tooltip}>
    
      <div style={{ fontWeight: 600 }}>
        {event.user?.username}
      </div>
    
      {/*style for icon with status*/}
      <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.8em",
            opacity: 0.8 
            }}
      >
        {icons[event.status]}
        <span>{event.status}</span>
      </div>
    </div>
  );
}  

export default CalendarEvent;
