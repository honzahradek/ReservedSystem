import { FiX, FiEdit, FiCheckCircle } from "react-icons/fi";
import { useContext } from "react";
import { UserContext } from "../../components/UserContext";
import { canEditReservation } from "../../components/ReservationCalendar/utils/canEditReservation";

const ReservationTable = ({ reservations, onEdit, role, onCancel, onConfirm }) => {
  const { user } = useContext(UserContext);

  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Room</th>
          <th>Start</th>
          <th>End</th>
          {role === "ADMIN" && (<th>User</th>)}
          <th>Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((r, i) => {
          const canEdit = canEditReservation(r, user?.username);
          return (
            <tr key={r._id || i}
              className={r.status === "PENDING"
                ? "table-light"   // Color blue
                : r.status === "CONFIRMED"
                  ? "table-success"   // Color green
                  : r.status === "CANCELLED"
                    ? "table-danger"    // Color red
                    : ""}>
              <td>{i + 1}</td>
              <td>{r.room?.name}</td>
              <td>{r.startFormatted}</td>
              <td>{r.endFormatted}</td>
              {role === "ADMIN" && (<td>{r.user?.username}</td>)}
              <td>{r.status}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  {role === "ADMIN" && (
                    <button 
                      className="btn btn-success btn-sm d-flex align-items-center gap-1 px-2 py-1"
                      onClick={() => onConfirm(r)}>
                        <FiCheckCircle size={14} className="me-1" />
                        Confirm
                    </button>
                  )}
                  <button 
                    className="btn btn-warning btn-sm d-flex align-items-center gap-1 px-2 py-1"
                    disabled={!canEdit}
                    onClick={() => onEdit(r)}>
                    <FiEdit size={14} className="me-1" />
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm d-flex align-items-center gap-1 px-2 py-1" 
                    onClick={() => onCancel(r)}>
                    <FiX size={14} className="me-1" />
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )
};

export default ReservationTable;