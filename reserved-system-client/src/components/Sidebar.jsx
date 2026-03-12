import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import { useContext } from "react";
import { FiSettings, FiUsers, FiHome, FiCalendar, FiGrid, FiUserCheck } from "react-icons/fi";


const Sidebar = () => {
  const { user } = useContext(UserContext);

  return (
      <nav className="sidebar">
        <h4 className="brand">ReservedSystem</h4>
        
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <FiGrid size={18} className="me-2"/>
              Dashboard
            </Link>
          </li>
          
          { user.role === "USER" && (
            <>
          <li>
            <Link to="/reservations/my" className="nav-link">
              <FiCalendar size={18} className="me-2"/> Reservation
            </Link>
          </li>
          
          <li>
            <Link to="/settings" className="nav-link">
              <FiSettings size={18} className="me-2" /> Setting
            </Link>
          </li>
          </>
          )}

          {user.role === "ADMIN" && (
          <>
            <li>
              <Link to="/admin/users" className="nav-link">
                <FiUsers size={18} className="me-2" /> Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/rooms" className="nav-link">
                <FiHome size={18} className="me-2" /> Manage Rooms
              </Link>
            </li>
            <li>
              <Link to="/reservations/confirm" className="nav-link d-flex align-items-start">
                <FiUserCheck size={20} className="me-2 mt-1" />
                <div className="lh-sm">
                  Admin<br />Reservations
                </div>
              </Link>
            </li>
          </>
          )}
        </ul>
      </nav>
  );
};

export default Sidebar;
