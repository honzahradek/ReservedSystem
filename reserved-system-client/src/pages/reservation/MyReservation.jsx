import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../components/UserContext";
import { apiGet, apiDelete } from "../../utils/api";
import FlashMessage from "../../components/FlashMessages";
import ReservationTable from "./ReservationTable";
import ReservationModal from "./ReservationModal";
import ReservationCalendar from "@/components/ReservationCalendar/ReservationCalendar";
import { arrayToDate, formatTime } from "@/utils/dateUtils";
import { FiList, FiCalendar } from "react-icons/fi";

const MyReservation = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;

  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [flashMessage, setFlashMessage] = useState({ text: "", theme: "" });
  const [viewMode, setViewMode] = useState("table"); // "table" | "calendar"

  /**
   * LOAD USER RESERVATIONS
   * Fetch reservations belonging to the logged-in user
   */
  const loadMyReservations = async () => {
    try {
      const data = await apiGet("/reservations/mine", {}, token);

      const parsed = data.map((item) => {
        const start = arrayToDate(item.startTime);
        const end = arrayToDate(item.endTime);

        return {
          ...item,
          start: start,
          end: end,
          startFormatted: formatTime(start),
          endFormatted: formatTime(end),
        };
      });

      setReservations(parsed);
    } catch (err) {
      console.error("Failed to load reservations", err);
      setFlashMessage({ text: "Failed to load reservations.", theme: "danger" });
    }
  };

  // Load reservations after component mount / token change
  useEffect(() => {
    if (token) loadMyReservations();
  }, [token]);

  /**
   * LOAD ROOMS
   * Used for displaying room information in reservations
   */
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await apiGet("/rooms/all", {}, token);
        setRooms(data);
      } catch (err) {
        console.error("Failed to load room", err);
      }
    };

    loadRooms();
  }, [token]);

  /**
   *CANCEL RESERVATION
   * User-triggered cancellation (outside of edit form)
   */
  const handleCancel = async (reservation) => {
    if (!window.confirm(`Are you sure you want to cancel this reservation " ${reservation.room?.name}"?`)) return;

    try {
      await apiDelete(`/reservations/cancel/${reservation._id}`, token);

      //Immediate UI update witout reloading data
      setReservations((prev) =>
        prev.map((r) =>
          r._id === reservation._id
            ? { ...r, status: "CANCELLED" }
            : r
        )
      );

      setFlashMessage({ text: `Reservation  for ${reservation.room?.name} was canceled successfully.`, theme: "success" });

    } catch (err) {
      console.error("Failed to load canceled reservation", err);
      setFlashMessage({ text: `Reservation for ${reservation.room?.name} wasn´t canceled.`, theme: "warning" });
    }
  };

  /**
    * Automatically hides flash messages after a delay
    */
  useEffect(() => {
    const timer = setTimeout(() => setFlashMessage({ text: "", theme: "" }), 5000);
    return () => clearTimeout(timer);
  }, [flashMessage.text]);


  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3">
        <h2 className="me-2 mb-0">My reservation</h2>
        <span className="badge bg-dark fs-6 py-2">{reservations.length}</span>
      </div>

      {reservations.length === 0 && (
        <small>
          User <b>{user.username}</b> has no reservation.
        </small>
      )}

      {flashMessage.text && (
        <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
      )}

      <div className="mb-3 d-flex">
        <button
          className={`d-flex align-items-center gap-1 px-2 py-1 btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => setViewMode("table")}
        >
          <FiList size={14} className="me-1" />Table
        </button>
        <button
          className={`d-flex align-items-center gap-1 px-2 py-1 btn btn-sm ${viewMode === "calendar" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setViewMode("calendar")}
        >
          <FiCalendar size={14} className="me-1" />Calendar
        </button>
      </div>

      {viewMode === "table" ? (
        <ReservationTable
          reservations={reservations}
          onEdit={(r) => setSelectedReservation(r)}
          onCancel={handleCancel}
        />
      ) : (
        <ReservationCalendar onReservationCreated={loadMyReservations} />
      )}

      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          rooms={rooms}
          onClose={() => setSelectedReservation(null)}
          onSave={(updated) => {
            console.log("ON SAVE RECEIVED", updated);
            setReservations((prev) =>
              prev.map((r) => (r._id === updated._id ? {
                ...updated,
                start: arrayToDate(updated.startTime),
                end: arrayToDate(updated.endTime),
                startFormatted: formatTime(arrayToDate(updated.startTime)),
                endFormatted: formatTime(arrayToDate(updated.endTime)),
              } : r))
            );
            setSelectedReservation(null);
            setFlashMessage({ text: "Reservation was successfully edited.", theme: "success" });
          }}
        />
      )}
    </div>
  );
};

export default MyReservation;
