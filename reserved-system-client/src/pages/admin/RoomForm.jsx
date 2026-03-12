import React, {useContext, useEffect, useState} from "react";
import { apiPost, apiPut } from "../../utils/api";

import InputField from "../../components/InputField";
import FlashMessage from "../../components/FlashMessages";
import { UserContext } from "../../components/UserContext";
import { FiSave, FiX } from "react-icons/fi";
import "./RoomForm.css";

/**
 * RoomForm component
 *
 * Handles creation and editing of meeting rooms.
 * Supports two modes:
 * - create mode (new room)
 * - edit mode (existing room)
 *
 * Responsibilities:
 * - manages form state and validation
 * - communicates with backend API (create / update)
 * - displays success and error feedback
 * - visually distinguishes create vs edit state
 */
const RoomForm = ({room, onRoomAdded, onCancelEdit }) => {
    // Current authenticated user (used for API authorization)
    const {user} = useContext(UserContext); 
    const token = user?.token; 
   
    // UI & form state
    const [focusedField, setFocusedField] = useState(null);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [flashMessage, setFlashMessage] = useState({text:"", theme: ""});

    //Controlled form data
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        capacity: ""
    });

    /**
     * Initializes form state when editing an existing room.
     * Normalizes room ID (_id vs id) to keep frontend consistent.
     */
    useEffect(() => {
        if (room) {
            const normalizedRoom = {
            ...room,
            id: room.id || room._id,
            };

            setFormData(normalizedRoom);
            setIsEditing(true);
        } else {
        setFormData({ name: "", location: "", capacity: "" });
        setIsEditing(false);
        }
    }, [room]);

    /**
     * Automatically hides flash messages after a short delay
     */
    useEffect(() => {
        const timer = setTimeout(() => setFlashMessage({ text: "", theme: "" }), 5000);
        return () => clearTimeout(timer);
        }, [flashMessage.text]);


    /**
     * Handles form submission:
     * - creates a new room if no ID is present
     * - updates an existing room otherwise
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
             
        try{
            let data;

            if(formData.id) {
                // Update existing room
                data = await apiPut(`/rooms/${formData.id}`, formData, token );
                
                setFlashMessage({text: `Room ${data.name} has been successfully modified.`, theme: "success"});
                
            } else {
                // Create new room
                data = await apiPost("/rooms/add",  formData, token );
                
                setFlashMessage({text: `Room ${data.name} has been successfully registered.`, theme: "success"});
                
                // Reset form after successful creation
                setFormData({ name: "", location: "", capacity:""});    
            }  
            
            // Notify parent component to refresh room list
            onRoomAdded();

            // Edit edit mode if applicable
            if (onCancelEdit) onCancelEdit();

        } catch (err) {
            console.error("Room submission falied:", err);
            setError("Room submission failed");
            setFlashMessage({text: "Room registration failed", theme: "warning"})
        }
    };


    return(
        <div className="container mt-4">
            <form 
                onSubmit={handleSubmit} 
                className={`p-4 border rounded-3 shadow-sm mt-3 transition-all
                     ${isEditing ? "editing-mode" : "creating-mode"

                }`}
            >

                <h4 className="mb-3">
                    {isEditing ? "Editting room" : "Add a new Meeting room"}
                </h4>
                
                    <div className={focusedField === "name" ? "focused p-2" : ""}>     
                        <InputField
                            required={true}
                            type="text"
                            name="name"
                            min="3"
                            label="Name of Meeting room"
                            prompt="Enter your name"
                            value={formData.name}
                            error={error}
                            handleChange={(e) => setFormData({ ...formData,name: e.target.value})}
                            onFocus={()=> setFocusedField("name")}
                            onBlur={()=> setFocusedField(null)}
                        />
                    
                        <InputField
                            required={true}
                            type="text"
                            name="location"
                            min="3"
                            label="Name of Location"
                            prompt="Enter your Location"
                            value={formData.location}
                            error={error}
                            handleChange={(e) => setFormData({ ...formData,location: e.target.value})}
                            onFocus={()=> setFocusedField("name")}
                            onBlur={()=> setFocusedField(null)}
                        />
                        <InputField
                            required={true}
                            type="number"
                            name="capacity"
                            min="1"
                            label="Number capacity"
                            prompt="Enter your number"
                            value={formData.capacity}
                            error={error}
                            handleChange={(e) => setFormData({ ...formData, capacity: e.target.value})}
                            onFocus={()=> setFocusedField("capacity")}
                            onBlur={()=> setFocusedField(null)}
                        />
                        
                         {flashMessage.text && (
                                        <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
                                    )}
                         {/*  {error && <div className="alert alert-danger">{error}</div>}*/}

                        <div className="d-flex justify-content-center gap-2"> 
                            <button type="submit" className="btn btn-dark">
                                <FiSave size={14} className="me-1" />
                                {isEditing ? "Save Changes" : "Submit" }
                            </button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary ms-2" 
                                    onClick={onCancelEdit}
                                >
                                    <FiX size={14} className="me-1" />
                                Cancel
                               </button>
                            )}
                        </div>    
                    </div>
                
            </form>  
        </div>     
    );
}

export default RoomForm;