import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/UserContext";

import { apiGet, apiDelete } from "../../utils/api";
import FlashMessage from "../../components/FlashMessages";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import "./UserManagement.css";
import { FiPlus } from "react-icons/fi";

const UserManagement = () => {
  // Access authenticated user and authorization token
  const { user } = useContext(UserContext);
  const token = user?.token;

  /**
  * Local state
  * - persons: list of users loaded from backend
  * - showForm: controls visibility of user form modal
  * - selectedPerson: currently edited user
  * - flashMessage: feedback message for user actions
  */
  const [persons, setPersons] = useState([]); // named "persons" to avoid confusion with context user
  const [flashMessage, setFlashMessage] = useState({ text: "", theme: "" });
  const [showForm, setShowForm] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  /**
   * Load all users from backend (admin endpoint)
   */
  const loadPersons = async () => {
    try {
      const data = await apiGet("/admin/users", {}, token);
      setPersons(data);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Unableto load users list.");
    }
  }

  /**
   * Initial load on component mount
   */
  useEffect(() => {
    loadPersons();
  }, []);

  /**
   * Delete selected user
   */
  const handleDelete = async (person) => {
    if (!window.confirm(`Are you sure you want to delete the user " ${person.username}"?`)) return;

    try {
      await apiDelete(`/admin/users/${person._id}`, token);
      setPersons((prev) => prev.filter((r) => r._id !== person._id));

      setFlashMessage({ text: `User ${person.username} was successfully deleted.`, theme: "success" });
    } catch (err) {
      console.error("User deletion failed", err);
      setFlashMessage({ text: `Unable to delete user ${person.username}.`, theme: "warning" });
    }
  };

  /**
   * Automatically hides flash messages after a delay
   */  
  useEffect(() => {
    const timer = setTimeout(() => setFlashMessage({ text: "", theme: "" }), 4500);
    return () => clearTimeout(timer);
  }, [flashMessage.text]);


  return (
    <div className="container mt-4">
      <h2>
        Manage Users
      </h2>
      <p className="text-muted">Here the admin can add, delete, and edit users.</p>

      {flashMessage.text && (
        <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
      )}

      <UserTable
        persons={persons}
        onDelete={handleDelete}
        label={`Count of Users: ${persons.length}`}
        onEdit={(person) => {
          setSelectedPerson(person);
          setShowForm(true);
        }}
      />

      {/* Buttons for add user */}

      <button
        className="btn btn-success mt-3"
        onClick={() => setShowForm(true)}
      >
        <FiPlus size={14} className="me-1" /> Add a new user
      </button>



      {/* Form in modal window*/}
      {showForm && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="card shadow p-4" style={{ minWidth: "400px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">

                <h5>{selectedPerson ? "Edit user" : "Add user"}</h5>

                <button
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>

              <UserForm
                token={token}
                onUserAdded={() => {
                  loadPersons();
                  setShowForm(false);
                  setSelectedPerson(null);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedPerson(null);
                }}
                person={selectedPerson}

              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
