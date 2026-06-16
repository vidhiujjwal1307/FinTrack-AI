import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h2>{user?.username}</h2>
        <p>{user?.email}</p>

        <button
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;