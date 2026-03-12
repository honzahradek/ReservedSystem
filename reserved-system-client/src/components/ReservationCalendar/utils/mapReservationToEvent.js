import { arrayToDate } from "@/utils/dateUtils";

/**
 * Maps a reservation object from the backend
 * into an event format used by the calendar UI.
 *
 * Converts date arrays into JavaScript Date objects
 * and normalizes the ID field for consistent handling.
 *
 * @param {Object} res  Reservation object from API
 * @returns {Object}    Calendar event object
 */
export const mapReservationToEvent = (res) => ({
  // Use reservationId if returned from edit endpoint, otherwise fallback to _id
  id: res.reservationId || res._id,

  // Display user's name in the calendar
  title: res.user?.username ?? "Unknown",

  // Convert backend date arrays into JS Date objects
  start: arrayToDate(res.startTime),
  end: arrayToDate(res.endTime),

  // Preserve business data for permission checks and UI logic
  status: res.status,
  room: res.room,
  user: res.user,
});
