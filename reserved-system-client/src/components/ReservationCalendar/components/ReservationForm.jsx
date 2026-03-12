import { formatDateTimeLocal } from "@/utils/dateUtils";
import { FiPlus, FiX } from "react-icons/fi";

const ReservationForm = ({ mode, event, start, end, room, onChange, onCancel, onCreate }) => {
  
 return (

  <div className="border border-primary p-3 mb-4 bg-light rounded">
    <h5> {mode === "create" ? "New reservation" : "Edit reservation"} – {room.name}</h5>

    <div className="row">
      <div className="col">
        <label>Start:</label>
        <input
          type="datetime-local"
          className="form-control"
          value={formatDateTimeLocal(start)}
          onChange={(e) =>
            onChange({start: new Date(e.target.value), end,})
          }
                  
                
        />
      </div>
      <div className="col">
        <label>End:</label>
        <input
          type="datetime-local"
          className="form-control"
          value={formatDateTimeLocal(end)}
          onChange={(e) =>
                  onChange({
              start,
              end: new Date(e.target.value),
            })
          }  
        />
      </div>
    </div>

    <div className="mt-3 d-flex justify-content-end text-end">
      <button className="btn btn-primary me-2" 
              onClick={() => onCreate({mode, start, end, event,})}
      >
        <FiPlus size={18} className="me-2"/>
        Enter
      </button>          
      <button className="btn btn-secondary" onClick={onCancel}>
        <FiX size={18} className="me-2" />
        Cancel
      </button>
    </div>
  </div>
);
}
export default ReservationForm;
