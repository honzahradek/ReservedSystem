/**
 * Builds a reservation payload in the format expected by the backend API.
 *
 * Converts Date objects to array format and normalizes room and user objects
 * so the backend receives only the required fields.
 *
 * @param {Object} params
 * @param {string|number} [params.eventId]  Reservation ID (used when editing)
 * @param {Date} params.start               Reservation start time
 * @param {Date} params.end                 Reservation end time
 * @param {string} params.status            Reservation status (PENDING, CONFIRMED, CANCELLED)
 * @param {Object} params.room              Selected room object
 * @param {Object} params.user              Logged-in user object
 *
 * @returns {Object} Payload ready to be sent to the backend API
 */

import { dateToArray } from "@/utils/dateUtils";

export const buildReservationPayload = ({
  eventId,
  start,
  end,
  status,
  room,
  user,
}) => ({
  reservationId: eventId,
  startTime: dateToArray(start),
  endTime: dateToArray(end),
  status: status,
  room:{
        _id: room._id,
        name: room.name,
        location: room.location,
        capacity: room.capacity,
      },
  user: {
        _id: user._id || user.userId,
        username: user.username,
        email: user.email,
        role: user.role
  } 
});
