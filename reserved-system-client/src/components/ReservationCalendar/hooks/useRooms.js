import { useEffect, useState } from "react";
import { apiGet } from "@/utils/api";


/**
 * Custom hook for loading available rooms from the backend.
 *
 * Responsibilities:
 *  - fetch list of rooms
 *  - store them in local state
 *  - keep data in sync with authentication token
 */
export const useRooms = (token) => {
   /**
   * List of available rooms
   */
  const [rooms, setRooms] = useState([]);
   
  // ----------------------------------------------------
  // Load rooms when token becomes available or changes
  // ----------------------------------------------------
  useEffect(() => {
     if (!token) {
      setRooms([]);
      return;
    }

    const loadsRooms = async () => {
      try {
        const data = await apiGet("/rooms/all", {}, token);
          setRooms(data);
          } catch (err) {
          console.error("Failed to load rooms", err);
      }
    }  

    loadsRooms();
  }, [token]);


  return {rooms};
};
