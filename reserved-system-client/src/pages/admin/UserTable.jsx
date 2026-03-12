import { FiEdit, FiTrash2 } from "react-icons/fi";

const UserTable = ({ persons, label, onEdit, onDelete }) => {
    return (
        <div>{label}
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {persons.map((person, index) => (
                        <tr key={person._id}>
                            <td>{index + 1}</td>
                            <td>{person.username}</td>
                            <td>{person.email}</td>
                            <td>{person.role}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => onEdit(person)}
                                >
                                    <FiEdit size={14} className="me-1" />
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => onDelete(person)}
                                >
                                    <FiTrash2 size={14} className="me-1" />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;