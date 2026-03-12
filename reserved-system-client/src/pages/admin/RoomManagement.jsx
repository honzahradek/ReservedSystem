import { useState, useEffect, useContext } from "react";
import { apiGet, apiDelete } from "../../utils/api";
import { UserContext } from "../../components/UserContext";

import RoomTable from "./RoomTable";
import RoomForm from "./RoomForm";
import FlashMessage from "../../components/FlashMessages";

/**
 * RoomManagement container component
 *
 * Manages meeting rooms administration:
 * - loads rooms from backend API
 * - allows creating, editing and deleting rooms
 * - coordinates RoomForm and RoomTable components
 * - handles global success/error feedback
 *
 * This component acts as a stateful container
 * and delegates UI rendering to child components.
 */
const RoomManagement = () => {
     // Access authenticated user and authorization token
    const { user } = useContext(UserContext); 
    const token = user?.token;
   
     // State management
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);// currently edited room
    const [flashMessage, setFlashMessage] = useState({text:"", theme: ""});
       
    
    /**
     * Loads all meeting rooms from the backend API.
     * Used on initial render and after create/update operations.
     */
    const loadRooms = async () => {
        try {
            const data = await apiGet("/rooms/all", {} , token);
            setRooms(data);
        } catch (err) {
            console.error("Failed to load rooms:",err);
            setFlashMessage({ text: "Failed to load room list.", theme: "warning",});
        }
    };
    

    /**
     * Initial load of rooms after component mount
     */
    useEffect(() => {
    loadRooms();
    }, []);


    /**
     * Deletes a room after user confirmation.
     * Updates local state without reloading the whole list.
     */
    const handleDelete = async (room) => {
        if (
          !window.confirm(
            `Are you sure you want to delete this room " ${room.name} " ? `
          )
        )
         return;
       
        try {
            await apiDelete(`/rooms/${room._id}`, token);
            setRooms((prev) => prev.filter((r) => r._id !== room._id));
            setFlashMessage({text: `Room ${room.name} was successfully deleted.`, theme: "success"});
        } catch (err) {
            console.error("Failed to delete room:", err);
            setFlashMessage({text: `Room ${room.name} could not be deleted.`, theme: "warning"});
        }
    };

    /**
     * Automatically hides flash messages after a delay
     */  
    useEffect(() => {
        const timer = setTimeout(
            () => setFlashMessage({ text: "", theme: "" }),
            5000
        );
        return () => clearTimeout(timer);
    }, [flashMessage.text]);
    
    /**
     * Layout:
     * - left column: RoomForm (create / edit)
     * - right column: RoomTable (list + actions)
     */
    return (
        <div className="container mt-4">
            {flashMessage.text && ( 
                    <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                                                )}
            
       
            <h2>RoomManagement</h2>
        
            <div className="row">
                <div className="col-md-5">
                    <RoomForm 
                        room={selectedRoom} 
                        onRoomAdded={loadRooms}
                        onCancelEdit={() => setSelectedRoom(null)}
                    />
                </div>

                
                <div className="col-md-7">
                    <RoomTable 
                        rooms={rooms}
                        onDelete={handleDelete}
                        label={`Count of Meeting rooms:`}
                        onEdit={(room)=> setSelectedRoom(room)}
                    />
                </div>
            </div>    
        </div>
    );
}

export default RoomManagement;