/**
 * Visual styles for calendar events based on reservation status
 * These styles define background and text colors for better readability.
 */
export const statusEventStyles = {
  PENDING: {
    backgroundColor: "#fff3cd",   // yellow – waiting for approval
    color: "#664d03",
  },
  CONFIRMED: {
    backgroundColor: "#d1e7dd",   // green – confirmed
    color: "#0f5132",
  },
  CANCELLED: {
    backgroundColor: "#f8d7da",   // red – cancelled
    color: "#842029",
  },
};

/**
 * Visual style used for temporary (preview) events
 * such as during drag & drop or reservation creation.
 */
export const ghostPreviewStyle = {
  opacity: 0.5,
  border: "2px dashed #ff9800",
  backgroundColor: "rgba(255, 152, 0, 0.35)",
};

/**
 * Returns the final style object for a calendar event.
 * It combines status-based styling with preview styling when needed.
 *
 * Used by CalendarView to style each event dynamically.
 *
 * @param {Object} event Calendar event
 * @returns {Object} Style configuration for react-big-calendar
 */
export const getEventStyle = (event) => {
  const baseStyle = statusEventStyles[event.status] || {};

  // Apply preview style when the event is being dragged or created
  if (event.isPreview) {
    return {
      style: {
        ...baseStyle,
        ...ghostPreviewStyle,
      },
    };
  }

  return {
    style: baseStyle,
  };
};


