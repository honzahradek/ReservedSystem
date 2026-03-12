import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-layout">
      {/* Sidebar left */}
      <Sidebar />

      {/* Content right */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
