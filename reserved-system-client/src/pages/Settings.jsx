/**
 * User settings component
 * Allows the user to update profile information (username, email)
 * and optionally change their password.
 */
import { useContext, useEffect, useState } from "react";
import { apiGet, apiPut } from "../utils/api";
import InputField from "../components/InputField";
import FlashMessage from "../components/FlashMessages";

import { UserContext } from "../components/UserContext";
import { FiSave, FiKey } from "react-icons/fi";

const Settings = () => {
  const { user, loginContext } = useContext(UserContext);
  const token = user?.token;

  // Form state for user profile data
  const [formPersonData, setFormPersonData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState({ text: "", theme: "" });

  /**
   * Loads the currently logged-in user from the backend
   * and pre-fills the form with existing profile data.
   */
  const loadPersons = async () => {
    try {
      const data = await apiGet("/users/me", {}, token);

      setFormPersonData({
        username: data.username,
        email: data.email,
        password: "",
        role: "USER"
      });
    } catch (err) {
      console.error("Failed to load user", err);

      setFlashMessage({ text: "Failed to load user.", theme: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    loadPersons()
  }, []);

  /**
   * Handles form submission for both profile update
   * and password change.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    setFlashMessage({ text: "", theme: "" });

    try {
      const data = await apiPut(`/users/me`, formPersonData, token);
      setFlashMessage({ text: `User ${formPersonData.username} was successfuly updated.`, theme: "success" });
      
      // Clear password field after successful update
      setFormPersonData((prev) => ({ ...prev, password: "" })); 
      
      // Update user context with new profile data
      loginContext(data.username, data.email, token, user.role);
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to save changes.");
      setFlashMessage({ text: "Failed to save changes.", theme: "error" });
    }
  }

   /**
   * Automatically hides flash messages after 3 seconds
   */
  useEffect(() => {
    const timer = setTimeout(() => setFlashMessage({ text: "", theme: "" }), 3000);
    return () => clearTimeout(timer);
  }, [flashMessage.text]);


  if (loading) return <p>Loading ...</p>;

  return (
    <div className="container mt-4">
      <h2>Settings</h2>

      {flashMessage.text && (
        <FlashMessage theme={flashMessage.theme} text={flashMessage.text} />
      )}

      {/* Sekce Profil */}
      <section className="mb-4">
        <h4>Profile</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <InputField
              required={true}
              type="text"
              name="username"
              min="3"
              label="Your username"
              prompt="Enter your username"
              value={formPersonData.username}
              error={error}
              handleChange={(e) => setFormPersonData({ ...formPersonData, username: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <InputField
              required={true}
              type="email"
              name="email"
              min="3"
              label="Your email"
              prompt="Enter your email"
              value={formPersonData.email}
              handleChange={(e) => setFormPersonData({ ...formPersonData, email: e.target.value })}
            />
          </div>
          <button className="btn btn-primary">
            <FiSave size={16} className="me-1" />
            Save changes
          </button>
        </form>
      </section>

      {/* Sekce Heslo */}
      <section className="mb-4">
        <h4>Change password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <InputField
              required={true}
              type="password"
              name="password"
              min="6"
              label="New password"
              prompt="Enter a new password if you want to change it"
              value={formPersonData.password}
              handleChange={(e) => setFormPersonData({ ...formPersonData, password: e.target.value })}
            />
            <small className="text-muted">
              If you leave the field empty, the password will remain unchanged.
            </small>
          </div>

          <button className="btn btn-warning">
            <FiKey size={16} className="me-1" />
            Change password</button>
        </form>
      </section>
    </div>
  );
};

export default Settings;
