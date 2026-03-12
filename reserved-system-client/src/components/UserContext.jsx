import { createContext, useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";

export const UserContext = createContext();

/**
 * Global authentication & session provider.
 * Handles:
 * - user persistence (localStorage)
 * - login / logout
 * - JWT expiration tracking
 * - session expiration warning
 */
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  // Restore user from localStorage on app startup
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Controls visibility of "session expiring" warning popup
  const [warningVisible, setWarningVisible] = useState(false);
  
 
  /**
   * Sync user from localStorage on first mount
   * (in case the page was refreshed)
   */
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

   /**
   * Log in user:
   * - store in state
   * - persist in localStorage
   */
  const loginContext = (userId, username, email, token, role) => {
    const userData = { userId, username, email, token, role };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Log out user:
   * - clear state
   * - clear localStorage
   * - redirect to login
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setWarningVisible(false);
    navigate("/login");
  };

  /**
   * Watch JWT expiration:
   * - show warning 60s before expiry
   * - auto logout when expired
   */
  useEffect(() => {
    if (!user?.token) return;

    try {
      const payload = JSON.parse(atob(user.token.split(".")[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();

      const timeLeft = expiresAt - now;

      if (timeLeft <= 0) {
        logout();
        return;
      }

      // Show warning 60 seconds before expiration
      const warningTime = timeLeft - 60_000 > 0 ? timeLeft - 60_000 : 0;

      const warningTimer = setTimeout(() => {
        setWarningVisible(true);
      }, warningTime);

      const logoutTimer = setTimeout(() => {
        setWarningVisible(false);
        logout();
        alert("Your session has expired. You have been logged out.");
      }, timeLeft);

      return () => {
        clearTimeout(warningTimer);
        clearTimeout(logoutTimer);
      };
    } catch (err) {
      // Invalid token -> logout for safety
      logout();
    }
  }, [user?.token]);

  return (
    <UserContext.Provider value={{ user, loginContext, logout, warningVisible, setWarningVisible }}>
      {children}
    </UserContext.Provider>
  );
};
