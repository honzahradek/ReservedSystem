import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../components/UserContext";
import InputField from "../../components/InputField";
import FlashMessage from "../../components/FlashMessages";
import { apiPut } from "../../utils/api";
import { formatDateTimeLocal } from "../../utils/dateUtils";
import { FiX, FiSave } from "react-icons/fi";
import { buildReservationPayload } from "../../components/ReservationCalendar/utils/buildReservationPayload";

const ReservationModal = ({ reservation, rooms, onClose, onSave }) => {
  const { user } = useContext(UserContext);
  const token = user?.token;

  // FORM STATE (pre-filled from selected reservation)
  const [formData, setFormData] = useState({
    roomId: reservation.room?._id || "",
    roomName: reservation.room?.name,
    startTime: reservation.start
      ? formatDateTimeLocal(reservation.start)
      : "",
    endTime: reservation.end
      ? formatDateTimeLocal(reservation.end)
      : "",
  });

  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState({ id: null, text: "", theme: "" });

  /**
   * Form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Confirm & save reservation changes
   */
  const handleConfirm = async () => {
    try {
      setLoading(true);

      // Find selected room object
      const room = rooms.find(
        (r) => String(r._id) === String(formData.roomId)
      );

      // Build backend - compatible payload
      const payload = buildReservationPayload({
        eventId: reservation._id,
        start: new Date(formData.startTime),
        end: new Date(formData.endTime),
        status: reservation.status,
        room,
        user: {
          _id: reservation.user._id,           // original user ID
          username: reservation.user.username, // original username
          email: reservation.user.email,       // original email
          role: reservation.user.role          // original role
        },
      });

      const result = await apiPut(`/reservations/edit/${reservation._id}`, payload, token);
      
      // Pass updated reservationback to parent component
      onSave(result);

    } catch (error) {
      if (error.status === 400 && error.data) {
        console.log("Validation error", error.data);

        const errorText = error.data.error || Object.values(error.data).join("");

        setFlashMessage({ text: errorText, theme: "danger" });
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update selected room when reservations changes
   */
  useEffect(() => {
    if (reservation.room?._id) {
      setFormData((prev) => ({ ...prev, roomId: reservation.room._id }));
    }
  }, [reservation]);


  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >

      <div className="modal-dialog">
        <div className="modal-content rounded-3 shadow">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">Edit reservation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/*Error message*/}
          {flashMessage?.text && (
            <FlashMessage key={flashMessage.id} theme={flashMessage.theme} text={flashMessage.text} />
          )}

          {/* Body */}
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Room:</label>
              <select
                className="form-select"
                value={formData.roomId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, roomId: e.target.value }))
                }
              >
                <option value="">-- Selected room --</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            <InputField
              type="datetime-local"
              name="startTime"
              label="Start"
              value={formData.startTime}
              handleChange={handleChange}
            />

            <InputField
              type="datetime-local"
              name="endTime"
              label="End"
              value={formData.endTime}
              handleChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <FiX className="me-1" />
              Storno
            </button>
            <button
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={loading}
            >
              <FiSave className="me-1" />
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
