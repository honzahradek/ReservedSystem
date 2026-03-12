/**
 * Determines whether the current user is allowed to edit a given reservation.
 *
 * This function is used for:
 *  - enabling/disabling edit buttons
 *  - allowing or blocking drag & drop in the calendar
 *  - protecting edit forms
 *
 * The conditions are evaluated top-down by priority.
 *
 * @param {Object} reservation  Reservation object
 * @param {Object} user         Logged-in user
 * @returns {boolean}           True if the reservation can be edited
 */
export const canEditReservation = (reservation, user) => {
  // Safety check – no reservation or no user
  if (!reservation || !user) return false;

  // Admin can always edit
  if (user.role === "ADMIN") return true;

  // Cancelled or confirmed reservations are locked
  if (reservation.status === "CANCELLED" || reservation.status === "CONFIRMED") {
    return false;
  }

  // The owner of the reservation can edit it
  if (reservation.user?._id === user.userId) return true;

  // Other users can edit only pending reservations (if allowed by business rules)
  if (reservation.status === "PENDING") return true;

  return false;
};
