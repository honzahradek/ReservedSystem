import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import MyReservation from "./pages/reservation/MyReservation";
import UserManagement from "./pages/admin/UserManagement";
import MainSite from "./pages/MainSite";
import RoomManagement from "./pages/admin/RoomManagement";
import RoomForm from "./pages/admin/RoomForm";
import AdminReservation from "./pages/reservation/AdminReservation";
import SessionWarning from "./components/SessionWarning";

const App = () => {
  return (
    <>
      {/* Global alert for expiration token */}
      <SessionWarning />
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public pages without layout (Login & Registration) */}
          <Route path="/" element={<MainSite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected pages using a shared layout*/}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="reservations">
              <Route path="my" element={<MyReservation />} />
              <Route path="confirm" element={<AdminReservation />} />
            </Route>
            <Route path="admin">
              <Route path="users" element={<UserManagement />} />
              <Route path="rooms" element={<RoomManagement />} />
              <Route path="new" element={<RoomForm />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App