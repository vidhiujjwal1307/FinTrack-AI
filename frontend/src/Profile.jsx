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

  <h2 className="profile-name">
    {user?.username}
  </h2>

  <div className="profile-details">

    <div className="profile-field">
      <label>Username: </label>
      <span>{user?.username}</span>
    </div>

    <div className="profile-field">
      <label>Email: </label>
      <span>{user?.email}</span>
    </div>

  </div>

  <button
    className="back-btn"
    onClick={() => navigate("/dashboard")}
  >
    Back to Dashboard
 
        </button>
      </div>
    </div>
  );
}

export default Profile;