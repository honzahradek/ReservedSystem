export const CalendarLegend = () => (
  <div className="d-flex gap-3 mt-3">
    <div className="d-flex align-items-center gap-2">
      <div style={{ width: 18, height: 18, background: "#66bb6a", borderRadius: 4 }}></div>
        <span>Confirmed</span>
    </div>

    <div className="d-flex align-items-center gap-2">
      <div style={{ width: 18, height: 18, background: "#ffeb3b", borderRadius: 4 }}></div>
      <span>Pending</span>
    </div>

    <div className="d-flex align-items-center gap-2">
      <div style={{ width: 18, height: 18, background: "#ef5350", borderRadius: 4 }}></div>
      <span>Cancelled</span>
    </div>
  </div>
);

