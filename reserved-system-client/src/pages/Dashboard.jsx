import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../components/UserContext";
import { apiGet } from "../utils/api";
import DashboardTable from "./DashboardTable";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const token = user?.token;

  const [count, setCount] = useState();
  const [active, setActive] = useState();
  const [last, setLast] = useState([]);


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch total number of reservations
        const total = await apiGet("/reservations/count", {}, token);
        setCount(total);

        // Fetch last five reservations
        const active = await apiGet("/reservations/active", {}, token);  
        setActive(active);

        const lastFiveReservation = await apiGet("/reservations/last", {}, token);

        // Backend send date as array: [year, month, day, hour, minute]
        // Convert it to JavaScript Date objects
        const parsed = lastFiveReservation.map((last) => {
          const start = new Date(
            last.startTime[0],     
            last.startTime[1] - 1, 
            last.startTime[2],     
            last.startTime[3],     
            last.startTime[4]      
          );
          const end = new Date(
            last.endTime[0],
            last.endTime[1] - 1,
            last.endTime[2],
            last.endTime[3],
            last.endTime[4]
          );
          return {
            ...last,
            startFormatted: start.toLocaleString("cs-CZ", { 
              dateStyle: "short",
              timeStyle: "short",
            }),
            endFormatted: end.toLocaleString("cs-CZ", {
              dateStyle: "short",
              timeStyle: "short",
            }),
          };
        });

        // Store processed data for rendering
        setLast(parsed); 
        
      } catch (err) {
        console.error("Failed to load reservation statistics:", err);
      }
    };

    fetchCounts();
  }, [token]);


  return (
    <div className="container-fluid">
      <div className="row">
        <main className="col-md-9 col-lg-9 px-4">
          <h1 className="mt-4">Welcome to Dashboard</h1>

          {/* Stat cards */}
          <div className="row my-4">
            <div className="col-md-12">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Count of Reservation</h5>
                  <p className="card-text fw-bold">{count}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row my-4">
            <div className="col-md-12">
              <div className="card text-white bg-success mb-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Active reservation</h5>
                  <span className="card-text fw-bold">{active}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <DashboardTable items={last}
            label="Last 5 reservation"
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;