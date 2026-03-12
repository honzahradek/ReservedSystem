import { useContext } from "react";
import { UserContext } from "./UserContext";

/**
 * Displays a warning popup when the user's session is about to expire.
 * The visibility is controlled globally via UserContext.
 */
const SessionWarning = () => {
  const { warningVisible, setWarningVisible } = useContext(UserContext);

  // Do not render anything if the warning is not active
  if (!warningVisible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      backgroundColor: "#facc15",
      padding: "10px 20px",
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      zIndex: 1000,
    }}>
      <p style={{ margin: 0 }}>
        Your session will expire soon! Save your work.
      </p>
      <button
        style={{ marginTop: 5, padding: "2px 6px" }}
        onClick={() => setWarningVisible(false)}
      >
      Close
      </button>
    </div>
  );
};

export default SessionWarning;
