import { useContext, useState, useEffect, useRef } from "react";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import cs from "date-fns/locale/cs";

import { UserContext } from "@/components/UserContext";
import RoomSelect from "@/components/ReservationCalendar/components/RoomSelect";
import { CalendarLegend } from "@/components/ReservationCalendar/components/CalendarLegend";
import ReservationForm from "@/components/ReservationCalendar/components/ReservationForm";
import CalendarView from "@/components/ReservationCalendar/components/CalendarView";
import { FlashMessage } from "@/components/FlashMessages";

import { useRooms } from "@/components/ReservationCalendar/hooks/useRooms";
import { useRoomReservations } from "@/components/ReservationCalendar/hooks/useRoomReservations";
import { canEditReservation } from "./utils/canEditReservation";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { cs },
});

// Main container for the reservation calendar
// Handles room selection, calendar state, reservation creation and editing
const ReservationCalendar = ({ onReservationCreated }) => {
  const { user } = useContext(UserContext);
  const token = user?.token;

  //Rooms and curently selected room
  const { rooms = [] } = useRooms(token);
  const [selectedRoom, setSelectedRoom] = useState(null);

  //Reservations for the selected room
  const { 
    events,
    createReservation, 
    updateReservation, 
    previewMove,
    rollbackPreview,
    removeCreatePreview, 
    createPreview, 
    clearPreview 
  } = useRoomReservations(selectedRoom, token);

  // Currently edited / created reservation
  const [activeReservation, setActiveReservation] = useState(null);

  // Prevents multiple edit dialogs from opening
  const [editLock, setEditLock] = useState(false);
  
  // Calendar navigation state
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  // UI feedback
  const [flashMessage, setFlashMessage] = useState({id:null, text: "", theme: ""});

  // ----------------------------------------------------
  // Automatically select the first room when rooms load
  // ----------------------------------------------------
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(rooms[0]);
    }
  },[rooms, selectedRoom]);

  // ----------------------------------------------------
  // Change selected room
  // ----------------------------------------------------
  const handleRoomSelect = (e) => {
    const id = e.target.value;
    const room = rooms.find((r) => String(r._id) === String(id));
    setSelectedRoom(room || null);
  };

  // ----------------------------------------------------
  // Click on empty calendar slot -> create new reservation
  // ----------------------------------------------------
  const handleSelectSlot = ({ start, end }) => {
    const preview = createPreview(start, end);

    setActiveReservation({
      mode: "create",
      start,
      end,
      previewId: preview.id,
    });
  };

  //-----------------------------------------------------
  // Click on existing event -> edit reservation
  //-----------------------------------------------------
  const handleSelectEvent = (event) => {
    if (editLock) return;
    
    // Permission check
    if (!canEditReservation(event, user)) {
      setFlashMessage({
        text: "This reservation cannot be edited.",
        theme: "warning",
      });
      return;
    }

    setEditLock(true);

    setActiveReservation({
      mode: "edit",
      start: event.start,
      end: event.end,
      event,
        originalStart: event.start,
        originalEnd: event.end,
    });
  };


  // ----------------------------------------------------
  // Create or update reservation (form submit)
  // ----------------------------------------------------
  const handleSubmitReservation = async ({mode, start, end, event}) => {
    try {
      if (mode === "create") {
        removeCreatePreview();

        const createdEvent = await createReservation({ start, end });
        
        // Immediately switch to edit mode for the newly created reservation
        setActiveReservation({
          mode: "edit",
          start: createdEvent.start,
          end: createdEvent.end,
          event: createdEvent,
        });
       
        setFlashMessage({ text: "Reservation created", theme: "success" });
        onReservationCreated?.(); 
        return;
      }
      
      if(mode === "edit") {
        await updateReservation(event, start, end);
        clearPreview(event.id);
        setFlashMessage({ text: "Reservation updated", theme: "success" });
        onReservationCreated?.(); 
      }

      // Close form after successful save
      setActiveReservation(null);
      setEditLock(false);

    }catch (err) {
      if (err.status === 400 && err.data) {
        const errorText=err.data.error || Object.values(err.data).join("");
        setFlashMessage({text: errorText, theme: "danger"});
      }
      return;     
    }
  };

  // ----------------------------------------------------
  // Drag & resize events -> preview only
  // ----------------------------------------------------
  const handleEventMove = async ({event, start, end}) => {
    console.log("Dragged event", event,start,end);

    if(!canEditReservation(event, user)){
      setFlashMessage({
        text: "You are not allowed to edit this reservation",
        theme: "warning"
      })
      return;
    }

    // Show temporary preview in calendar
    previewMove(event,start, end);

    // Open edit form
      setActiveReservation({
          mode: "edit",
          event: {...event, isPreview: true,},
          start,
          end,
          originalStart: event.start,
          originalEnd: event.end

        });
  };

  //----------------------------------------------------------
  // Cancel form ( not canceling reservation!)
  //----------------------------------------------------------
  const handleCancel = () => {
    if (!activeReservation) return;
    
    if(activeReservation.mode === "create") {
      removeCreatePreview();
    }

    if(activeReservation.mode === "edit"){
      rollbackPreview(activeReservation.event,
        activeReservation.originalStart,
        activeReservation.originalEnd
      );
    
      clearPreview(activeReservation.event.id);
    }  

    setActiveReservation(null);
    setEditLock(false);
  };

  // ----------------------------------------------------
  // Auto-hide flash messages
  // ----------------------------------------------------
  useEffect(() => {
    if (!flashMessage) return;

    const timer = setTimeout(() => {
      setFlashMessage({text: "", theme: "", id: null});
    }, 5000);

    return () => clearTimeout(timer);
  }, [flashMessage]);

  return (
    <div className="mt-4">
      {flashMessage.text && (<FlashMessage key={flashMessage.id} theme={flashMessage.theme} text={flashMessage.text} />
                   )}

      <h3>Reservation Calendar (Meetting room)</h3>

      {/* Choose a room */}
      <RoomSelect
        rooms={rooms}
        selectedRoom={selectedRoom}
        onChange={handleRoomSelect}
      /> 
     
      {/* Form a new reservation */}
      {activeReservation && (
        <ReservationForm
          mode={activeReservation.mode}
          event={activeReservation.event}
          start={activeReservation.start}
          end={activeReservation.end}
          room={selectedRoom}
          user={user}
          onChange={({ start, end }) => 
            setActiveReservation((prev) => ({
              ...prev,
              start,
              end,
            }))
          }
          onCancel={handleCancel}
          onCreate={handleSubmitReservation}
        />
      )}

      {/* Calendar */}
      {selectedRoom && (
        <CalendarView
          events={events}
          view={view}
          date={date}
          onNavigate={setDate}
          onViewChange={setView}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventMove}
          onEventResize={handleEventMove}
        />
      )}
     
      {/* CalendarLegend */}
      <CalendarLegend />
    </div>
  );
};

export default ReservationCalendar;
