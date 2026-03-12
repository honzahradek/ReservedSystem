import { useEffect, useState, useContext } from "react";
import { apiGet, apiPut, apiPost } from "@/utils/api";
import { arrayToDate } from "@/utils/dateUtils";
import { buildReservationPayload } from "@/components/ReservationCalendar/utils/buildReservationPayload";

import { UserContext } from "@/components/UserContext";
import { mapReservationToEvent } from "../utils/mapReservationToEvent";

/**
 * Custom hook for handling reservations of a single room.
 * Responsibilities:
 *  - load reservations from backend
 *  - manage optimistic UI updates
 *  - handle preview states for drag & drop
 *  - rollback on failed updates
 */
export const useRoomReservations = (selectedRoom, token) => {

  /**
   * All calendar events (room reservations)
   * Each event is compatible with react-big-calendar
   */
  const [events, setEvents] = useState([]);
  const { user } = useContext(UserContext);

  //-------------------------------------------------------
  // Load reservations when selected room changes
  //-------------------------------------------------------
  useEffect(() => {
      
    if (!selectedRoom) {
     setEvents([]);
     return;
    }  
    
    const loadReservations = async () => {
       try {
        const data = await apiGet(`/reservations/room/${selectedRoom._id}`, {} , token);
        
         /**
         * Convert backend DTOs into calendar event objects
         */
        const mapped = data.map((res) => ({
          id: res._id,
          title: `${res.user?.username || "Unknow"} (${res.status})`,
          start: arrayToDate(res.startTime),
          end: arrayToDate(res.endTime),
          user: res.user,
          status: res.status
        }));

        setEvents(mapped);

      } catch (err) {
        console.error("Mistake for load reservation",err);
        setEvents([]);
      }
    };
 
    loadReservations();
  
  }, [selectedRoom, token]);

 
  // ----------------------------------------------------
  // Create a new reservation (optimistic UI)
  // ----------------------------------------------------
  const createReservation = async (data) => {

    /**
     * Build request payload in backend format
     */
    const reservationData = buildReservationPayload({
      start: data.start,
      end: data.end,
      status: "PENDING",
      room: selectedRoom,
      user,
    });

    /**
     * Save reservation on the server
     */
    const saved = await apiPost("/reservations/new", reservationData, token);

    /**
     * Convert server response into calendar event
     */
    const event = mapReservationToEvent(saved)

    /**
     * If a preview event exists, replace it with real data
     */
    setEvents((prev) => {
    const hasPreview = prev.some((e) => e.id === "preview-create");

    if (hasPreview){
        return prev.map((e) =>
          e.id === "preview-create"
            ? { ...event, isPreview: false }
            : e
        );

      }
     
      /**
       * Otherwise just append the new event
       */
      return [...prev, event];
    });

    return event; 
  
  };

  // ----------------------------------------------------
  // Update existing reservation (drag / resize)
  // ----------------------------------------------------
  const updateReservation = async (event, start, end) => {

    /**
     * Backup original state in case we need to rollback
     */
    const original = { ...event };

    /**
     * Optimistic UI – update immediately
     */
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, start, end } : e
      )
    );

    try {
      const editData = buildReservationPayload({
        eventId: event.id,
        start,
        end,
        status: event.status,
        room: selectedRoom,
        user
      });

     
      const updated = await apiPut(`/reservations/edit/${event.id}`, editData, token);
          
      /**
       * Synchronize UI with backend response
       */
      setEvents((prev) =>
        prev.map((e) =>
          e.id === updated.reservationId
            ? {...mapReservationToEvent(updated), isPreview:false }
            : e
        )
      );
        
        return updated; 
    } catch (err) {

      /**
       * Server rejected the update → restore original state
       */
      setEvents((prev) =>
        prev.map((e) =>
          e.id === original.id ? original : e
        )
      );
      
      console.error("Update failed", err);
      
      throw err; 
        
    }
  };


  // -----------------------------------------------
  // Create a temporary preview for new reservation
  // -----------------------------------------------
  const createPreview = (start, end) => {
    const previewEvent = {
      id: "preview-create",
      title: "New reservation",
      start,
      end,
      status: "PENDING",
      isPreview: true,
    };

    setEvents((prev) => [...prev, previewEvent]);

    return previewEvent;
  };

  //-----------------------------------------
  //  Temporary move preview (dragging)
  //------------------------------------------
  const previewMove = (event, start, end) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, start, end, isPreview: true }
          : e
      )
    );
  };

  //---------------------------------------------
  // Rollback to original position (cancel drag)
  //---------------------------------------------
  const rollbackPreview = (event, originalStart, originalEnd) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              start: originalStart,
              end: originalEnd,
              isPreview: false,
            }
          : e
      )
    );
  };

  //-------------------------------------------
  // Confirm preview after successful save
  //-------------------------------------------
  const clearPreview = (eventId) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, isPreview: false } : e
      )
    );
  };

  // -----------------------------------------
  // Remove preview when create is cancelled
  // -----------------------------------------
  const removeCreatePreview = () => {
    setEvents((prev) => prev.filter((e) => e.id !== "preview-create"));
  };

  return {
    events,
    createPreview,
    createReservation,
    updateReservation,
    previewMove,
    rollbackPreview,
    clearPreview,
    removeCreatePreview,
  };
};