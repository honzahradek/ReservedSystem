import { useState, useEffect } from "react";
import { apiPost, apiPut } from "../../utils/api";
import { FiSave, FiX} from "react-icons/fi";

import FlashMessage from "../../components/FlashMessages";
import InputField from "../../components/InputField";

/**
 * UserForm component
 *
 * Used by administrators to:
 * - create a new user
 * - edit an existing user
 *
 * Supports two modes:
 * - create mode (empty form)
 * - edit mode (pre-filled form, password optional)
 *
 * The component handles its own form state,
 * validation feedback and API communication.
 */
const UserForm = ({ token, onUserAdded, onCancel, person }) => {
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "USER",
    password: "",
  });

  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [flashMessage, setFlashMessage] = useState({text:"", theme:""});

  /**
   * Loads user data into the form when editing.
   * - Normalizes backend IDs
   * - Ensures role fallback
   * - Never exposes password
   */
  useEffect(() => {
    if (person) {
      const normalizedPerson = {
        ...person,
        id: person.id || person._id, 
        role: person.role || "USER", 
        password:"", // password is never pre-filled
      };
      
      setFormData(normalizedPerson);
      setIsEditing(true);
    } else {
      // Reset form for create mode
      setFormData({ username: "", email: "", role: "USER", password: "" });
      setIsEditing(false);
    }
  }, [person]);

  /**
   * Handles form submission.
   * - Creates a new user or updates an existing one
   * - Removes empty password on edit to avoid overwriting
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
   
    try {
      let data;
      const payload = { ...formData};

      // If editing and password is empty, do not send it
      if (isEditing && !formData.password) {
        delete payload.password;
      }
      
      if(formData.id) {
        // Edit existing user
        data = await apiPut(`/admin/users/${formData.id}`, payload, token );
        
        setFlashMessage({text: `User ${formData.username} has been successfully updated.`, theme: "success"});
      } else {
        // Create new user
        data = await apiPost("/admin/users", payload, token);
        
        setFlashMessage({text: `Uživatel ${data.username} byla úspěšně zaregistrována.`, theme: "success"});
      } 
       
      // Reset form
      setFormData({
        username: "",
        email: "",
        role: "USER",
        password: "",
      });

      // Delay closing to allow user to read success message
      setTimeout(() => {
        onUserAdded(); // refresh user list
        onCancel(); // close form
          
      }, 3000);

    } catch (err) {
      console.error(err);
      
      setFlashMessage({
        text: "Failed to save user.",
        theme: "danger",
      });
    }
  };

  /**
   * Automatically hides flash messages after a short delay
   */
  useEffect(() => {
    const timer = setTimeout(
      () => setFlashMessage({ text: "", theme: "" }),
      3000
    );
      
    return () => clearTimeout(timer);
  }, [flashMessage.text]);
  

  return (
    <form onSubmit={handleSubmit}>
      <h5>{isEditing ? "Edit user" : "Add a new user"}</h5>

      {flashMessage.text && (
          <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
       )}

      <div className="mb-3">
        <InputField
          required={true}
          type="text"
          name="username"
          min="3"
          label="Your username"
          prompt="Enter your username"
          value={formData.username}
          error={error}
          handleChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <InputField
          required={true}
          type="email"
          name="Email"
          min="3"
          label="Your email"
          prompt="Enter your email"
          value={formData.email}
          handleChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Role</label>
        <select
          className="form-select"
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <div className="mb-3">
        <InputField
          required={!isEditing}
          label={`Password ${isEditing ? "(leave empty if you don´t want to change it)" : ""}`}
          type="password"
          prompt={isEditing ? "••••••••" : ""}
          value={formData.password}
          handleChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>
      <div className="d-flex justify-content-center gap-2">
        <button type="submit" className="btn btn-primary me-2">
          <FiSave size={14} className="me-1" />
          {isEditing ? "Save changes" : "Submit"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <FiX size={14} className="me-1" />
          Cancel
        </button>
      </div>  
    </form>
  );
};

export default UserForm;
