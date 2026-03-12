const DashboardTable = ({ label, items }) => {

  return (
    <div>
      <h2>{label}</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>MeetingRoom</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>{item.room.name}</td>
              <td>{item.startFormatted}</td>
              <td>{item.endFormatted}</td>
              <td>{item.status}</td>
              <td>{item.user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashboardTable;