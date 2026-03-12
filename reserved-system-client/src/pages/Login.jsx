import { useState, useContext } from "react";
import { UserContext } from "../components/UserContext";
import { apiPost } from "../utils/api";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Access login function from UserContext
  // Stores authenticated user data into global context
  const { loginContext } = useContext(UserContext); 

  /**
   * Client-side form validation
   */ 
  const validateForm = () => {
    // Basic email format validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Minimum password length validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  /**
   * Handle login form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Stop submission if validation fails
    if (!validateForm()){
            return;
      }

    try {
      // Authenticate user via backend API
      const data = await apiPost("/auth/login",{ email, password });
      
      // Save user data and token into context + localStorage
      loginContext(
        data.userId, 
        data.username, 
        data.email, 
        data.token, 
        data.role);

      // Show success message and redirect to dashboard  
      setMessage("Login successful!");
      navigate("/dashboard");
     
    } catch (err) {
      setError("Login failed.");
    }
  };

  return (
    <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center">Login</h3>
              <form onSubmit={handleSubmit}>
                                    
                  <InputField
                    required={true}
                    type="text"
                    name="email"
                    min="3"
                    label="Email"
                    prompt="Enter your email"
                    value={email}
                    error={error}
                    handleChange={(e) => 
                        setEmail(e.target.value)
                    }
                    autoComplete="username"
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
                    handleChange={(e) => 
                        setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                  />
                        
                  {message && <div className="alert alert-success">{message}</div>}

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

export default Login;
