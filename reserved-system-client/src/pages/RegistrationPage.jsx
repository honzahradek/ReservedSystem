/**
 * User registration page
 * Handles creation of a new user account via backend API
 */

import { useState } from "react";
import { apiPost } from "../utils/api";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const RegistrationPage = () => {
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null); //pro zvýraznění

  const navigate = useNavigate();

  /**
   * Client-sidevform validation
   */
  const validateForm = () => {
    if (username.trim().length < 3) {
      setError("Uživatelské jméno musí mít alespoň 3 znaky.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Zadejte platný email.");
      return false;
    }
    if (password.length < 6) {
      setError("Heslo musí mít alespoň 6 znaků.");
      return false;
    }
    return true;
  };

  /**
   * Form submit handler
   * Send registration request to backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Stop submission if validation fails
    if (!validateForm()) return;

    try {
      const data = await apiPost("/auth/register", { username, email, password });
      setSuccess(`User ${data.username} was successfully registered.`);

      // Redirect to login page after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registration failed. Please check your details and try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center">Registrace</h3>
              <form onSubmit={handleSubmit}>

                <div className={focusedField === "username" ? "focused p-2" : ""}>
                  <InputField
                    required={true}
                    type="text"
                    name="username"
                    min="3"
                    label="Username"
                    prompt="Enter your username"
                    value={username}
                    error={error}
                    handleChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                <InputField
                  required={true}
                  type="text"
                  name="email"
                  min="3"
                  label="Email"
                  prompt="Enter your email"
                  value={email}
                  error={error}
                  handleChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <InputField
                  required={true}
                  type="password"
                  name="password"
                  min="3"
                  label="Password"
                  prompt="Enter your password"
                  value={password}
                  error={error}
                  handleChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="d-grid mt-3">
                  <button type="submit" className="btn btn-dark">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default RegistrationPage;