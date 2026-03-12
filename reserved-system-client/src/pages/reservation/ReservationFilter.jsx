import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import InputSelect from "@/components/InputSelect";
import InputField from "@/components/InputField";


const ReservationFilter = (props) => {
    const navigate = useNavigate();// Used to update URL query parameters
    
    /**
     * HANDLE INPUT CHANGE
     * Wrapper function to pass change events to parent filter hook  
     */
    const handleChange=(e) => {
        props.handleChange(e);
    };

    /**
     * SUBMIT FILTER
     * Applies filter, updates URL query params and prevents reload
     */
    const handleSubmit=(e) => {
        e.preventDefault();
        
        // Trigger parent submit handler (API fetch)
        props.handleSubmit(e);

        // Sync active filters to URL query params
        const params = new URLSearchParams();
        if (props.filter.roomID) params.set("roomID", props.filter.roomID); 
        if (props.filter.startTime) params.set("startTime", props.filter.startTime);
        if (props.filter.endTime) params.set("endTime", props.filter.endTime);
        if (props.filter.userID) params.set("userID", props.filter.userID);
        if (props.filter.status) params.set("status", props.filter.status);
        if (props.filter.limit) params.set("limit", props.filter.limit);

        navigate(`/reservations/confirm?${params.toString()}`);
    };

    const filter = props.filter;

    /**
     * COLLAPSE / EXPAND FILTER PANEL
     * Controls visibility of filter inputs
     */
     const [isCollapsed, setIsCollapsed] = useState(true);
     
     const handleToggleCollapse=()=> {
         setIsCollapsed(!isCollapsed);
     }

    return (
        <div>
            <div className="card bg-light mb-3 border-0">
                <div className="card-header bg-secondary border-bottom-0 ">
                    <a href="#filterLink" className="text-decorative-none text-white" onClick={handleToggleCollapse}>Filter</a>
                </div>

                <div id="filterLink" className={`collapse ${isCollapsed ? 'show' : ''}`}>
                    <div className="card-body border border-3 border-secondary">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-lg">
                                    <InputSelect
                                        name="roomID"
                                        items={props.roomList}
                                        handleChange={handleChange}
                                        label="Room"
                                        prompt="empty"
                                        value={filter.roomID || ""}
                                    />
                                </div>
                                <div className="col-12 col-lg">
                                    <InputField
                                        type="datetime-local"
                                        min="3"
                                        name="startTime"
                                        handleChange={handleChange}
                                        label="Start"
                                        prompt="empty"
                                        value={filter.startTime || ""}
                                    />
                                </div>
                                <div className="col-12 col-lg">
                                    <InputField
                                        type="datetime-local"
                                        min="3"
                                        name="endTime"
                                        handleChange={handleChange}
                                        label="End"
                                        prompt="empty"
                                        value={filter.endTime || ""}
                                        
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-lg">
                                    <InputSelect
                                        name="userID"
                                        items={props.userList}
                                        handleChange={handleChange}
                                        label="User"
                                        prompt="empty"
                                        value={filter.userID || ""}
                                    />
                                </div>
                                <div className="col-12 col-lg">
                                    <InputSelect
                                        name="status"
                                        items={props.statusList}
                                        enum={props.statusEnum}
                                        handleChange={handleChange}
                                        label="Status"
                                        prompt="empty"
                                        value={filter.status || ""}
                                    />
                                </div>
                                <div className="col-12 col-lg">
                                    <InputField
                                        type="number"
                                        min="1"
                                        name="limit"
                                        handleChange={handleChange}
                                        label="Limit count of reservations"
                                        prompt="empty"
                                        value={filter.limit ? filter.limit : ''}
                                    />
                                </div>
                            </div>
                        
                            <div className="row">
                                <div className="col mt-2">
                                    <input
                                        type="submit"
                                        className="btn btn-secondary float-start"
                                        value={props.confirm}
                                    />
                                    <input
                                        type="button"
                                        className="btn btn-dark ms-2"
                                        value="Clear filter"
                                        onClick={props.handleClearFilter}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>                              
    );
};

export default ReservationFilter;