import { FiEdit, FiTrash2 } from "react-icons/fi";

const RoomTable = ({ rooms, onEdit, onDelete, label }) => {
    return (
        <div className="container mt-4">
            <h3>Table of Meeting room</h3>
            <span className="float-start mb-1">{label}
                <span className="badge bg-dark ms-1">{rooms.length}</span>
            </span>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Action</th>
                    </tr>    
                </thead>
                <tbody className="table-light">
                    {rooms.map((room, index) => (
                        <tr key={room._id}>
                            <td>{index+1}</td>
                            <td>{room.name}</td>
                            <td>{room.location}</td>
                            <td>{room.capacity}</td>
                            <td>
                                <div className="btn-group d-flex justify-content-center gap-2">
                                    <button  className="btn btn-sm btn-warning"
                                         onClick={() => onEdit(room)} 
                                    >
                                        <FiEdit size={14} className="me-1" />        
                                        Edit
                                    </button>
                                     <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => onDelete(room)}
                                    >
                                        <FiTrash2 size={14} className="me-1" />
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RoomTable;