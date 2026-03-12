/**
 * RoomSelect
 * ----------------------------
 * Dropdown component for selecting a meeting room.
 *
 * @param {Array} rooms        List of available rooms
 * @param {Object} selectedRoom Currently selected room object
 * @param {Function} onChange  Callback triggered when the selected room changes
 *
 * The component is controlled via `selectedRoom` and emits only the room ID
 * through the native <select> change event.
 * 
 * This component is used as the primary room selector
 * for loading and displaying reservations in the calendar.
 * 
 */
const RoomSelect = ({ rooms = [], selectedRoom, onChange }) => {

 return (
  <div className="mb-3">
    <label className="form-label">Select room</label>
    <select
      className="form-select"
      value={selectedRoom?._id || ""}
      onChange={(e) => onChange(e)}
    >
      <option value="">-- Select room --</option>
      {rooms.map((room) => (
        <option key={room._id} value={room._id}>
          {room.name}
        </option>
      ))}
    </select>
  </div>
 );
}; 

export default RoomSelect;