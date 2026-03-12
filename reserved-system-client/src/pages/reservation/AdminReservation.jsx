/**
 * AdminReservation
 * -----------------
 * Admin interface for managing all reservations.
 * Allows:
 * - viewing reservations in table or calendar view
 * - filtering reservations
 * - confirming / canceling reservations
 * - editing reservation details
 */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiList, FiCalendar } from "react-icons/fi";

import { UserContext } from "../../components/UserContext";
import FlashMessage from "../../components/FlashMessages";
import ReservationTable from "./ReservationTable";
import ReservationCalendar from "@/components/ReservationCalendar/ReservationCalendar";
import ReservationModal from "./ReservationModal";
import ReservationFilter from "./ReservationFilter";

import { apiGet, apiPut, apiDelete } from "../../utils/api";
import { arrayToDate, formatTime } from "../../utils/dateUtils";
import { useFilter } from "@/components/ReservationCalendar/hooks/useFilter";
import { RESERVATION_STATUS } from "@/constants/reservationStatus";


const AdminReservation = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([])
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [flashMessage, setFlashMessage] = useState({ text: "", theme: "" });
  const [viewMode, setViewMode] = useState("table"); // "table" | "calendar"

  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  const { filter, handleChange, clearFilter, getParams } = useFilter({
    roomID: undefined,
    userID: undefined,
    status: undefined,
    startTime: undefined,
    endTime: undefined,
    limit: undefined
  });

  /* 
   * LOAD ALL RESERVATIONS (ADMIN)
   * Applies active filters if provided
   */ 
  const loadReservations = async (appliedFilter = filter) => {
    try {

      const params = getParams(appliedFilter);

      const data = await apiGet("/reservations/all", params, token);

      const parsed = data.map((item) => {
        const start = arrayToDate(item.startTime);
        const end = arrayToDate(item.endTime);
        return {
          ...item,
          start: start,
          end: end,
          startFormatted: formatTime(start),
          endFormatted: formatTime(end)
        };
      });

      setReservations(parsed);


    } catch (err) {
      console.error(err);
      setFlashMessage({ text: "Failed to load reservations.", theme: "danger" });
    }
  };

  useEffect(() => {
    if (token) loadReservations();
  }, [token]);

  /**
   * LOAD ALL ROOMS
   * Used for reservation editing & filter select
   */
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await apiGet("/rooms/all", {}, token);
        setRooms(data);
        setRoomList(data);

      } catch (err) {
        console.error(err);
      }
    };

    loadRooms();
  }, [token]);

  /**
   * LOAD USERS FOR FILTER (ADMIN ONLY)
   * Used to populate user select input
   */ 
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await apiGet("/admin/users", {}, token);
        const usersForSelect = data.map(user => ({
          _id: user._id,
          name: user.username,
        }));

        setUserList(usersForSelect);

      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    if (token && user.role === "ADMIN") loadUsers();
  }, [token]);

  /**
   * CONFIRM reservation (ADMIN)
   */
  const handleConfirm = async (reservation) => {
    try {
      const res = await apiPut(`/reservations/confirm/${reservation._id}`, {}, token);

      setFlashMessage({ text: "The reservation has been confirmed.", theme: "success" });
      loadReservations(filter);
    } catch (err) {
      console.error(err);
      setFlashMessage({ text: err.message || "Unable to confirm reservation.", theme: "danger" });
    }
  };

  /**
   *  CANCEL reservation (ADMIN)
   */
  const handleCancel = async (reservation) => {
    if (!window.confirm(`Are you sure you want to cancel this reservation?`)) return;

    try {
      await apiDelete(`/reservations/cancel/${reservation._id}`, token);
      setFlashMessage({ text: "The reservation was canceled.", theme: "warning" });
      loadReservations(filter);
    } catch (err) {
      console.error(err);
      setFlashMessage({ text: "Unable to cancel reservation.", theme: "danger" });
    }
  };

  /**
   * Reservation Update - save changes for editing 
   */
  const handleReservationUpdate = (updated) => {
    // Change format date & time for table displaying
    setReservations((prev) =>
      prev.map((r) =>
        r._id === updated._id
          ? {
            ...updated,
            start: arrayToDate(updated.startTime),
            end: arrayToDate(updated.endTime),
            user: r.user,
            startFormatted: formatTime(arrayToDate(updated.startTime)),
            endFormatted: formatTime(arrayToDate(updated.endTime)),
          }
          : r
      )
    );

    setSelectedReservation(null);
    setFlashMessage({ text: "Reservation was successfully edited.", theme: "success" });
  };

  /**
   * FILTER
   * Handle ClearFilter - with help hook useFilter
   */
  const handleClearFilter = () => {
    clearFilter();
    loadReservations({});
    navigate("/reservations/confirm");
  };

  /**
   * Handle SubmitFilter
   */
  const handleSubmitFilter = async (e) => {
    e.preventDefault();

    try {
      const params = getParams();
      const data = await apiGet("/reservations/all", params, token);
      const parsed = data.map((item) => {
        const start = arrayToDate(item.startTime);
        const end = arrayToDate(item.endTime);

        return {
          ...item,
          start: start,
          end: end,
          startFormatted: formatTime(start),
          endFormatted: formatTime(end)
        };
      });

      if (parsed.length === 0) {
        setFlashMessage({ text: "No reservation found", theme: "warning" });
      }

      setReservations(parsed);
    } catch (err) {
      console.error("Failed to load data", err);
      setFlashMessage({ text: "Failed to load reservations.", theme: "danger" });
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
        <h2 className="me-2 mb-0">All reservations</h2>
        <span className="badge bg-dark fs-6 py-2">{reservations.length}</span>
      </div>

      {flashMessage.text && (
        <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
      )}

      {/* Switch view */}
      <div className="mb-3 d-flex">
        <button
          className={`d-flex align-items-center gap-1 px-2 py-1 btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"
            } me-2`}
          onClick={() => setViewMode("table")}
        >
          <FiList size={14} className="me-1" /> Table
        </button>

        <button
          className={`d-flex align-items-center gap-1 px-2 py-1 btn btn-sm ${viewMode === "calendar" ? "btn-primary" : "btn-outline-primary"
            }`}
          onClick={() => setViewMode("calendar")}
        >
          <FiCalendar size={14} className="me-1" /> Calendar
        </button>
      </div>

      {/* Table or Calendar */}
      {viewMode === "table" ? (
        <>
          <ReservationFilter
            filter={filter}
            userList={userList}
            roomList={roomList}
            statusList={Object.keys(RESERVATION_STATUS)}
            statusEnum={RESERVATION_STATUS}
            handleChange={handleChange}
            handleSubmit={handleSubmitFilter}
            confirm="Filter items"
            handleClearFilter={handleClearFilter}
          />
          <ReservationTable
            reservations={reservations}
            role="ADMIN"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onEdit={(r) => setSelectedReservation(r)}
          />
        </>
      ) : (

        <ReservationCalendar onReservationCreated={loadReservations} />
      )}

      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          rooms={rooms}
          onClose={() => setSelectedReservation(null)}
          onSave={handleReservationUpdate}
        />
      )}
    </div>
  );
};

export default AdminReservation;