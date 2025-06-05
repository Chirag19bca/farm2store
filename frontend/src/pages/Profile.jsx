import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Store, Sprout } from "lucide-react";
import AuthContext from "../context/AuthContext"; // Import AuthContext
import classes from "../styles/Profile.module.css";

function Profile() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect if no user is logged in
    } else {
      setUpdatedUser({ ...user }); // Initialize updatedUser with current user data
    }
  }, [user, navigate]);

  const goToDashboard = () => {
    if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user?.role === "farmer") {
      navigate("/farmer-dashboard");
    } else if (user?.role === "retailer") {
      navigate("/retailer-dashboard");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  // Save changes (Update in Database)
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/updateProfile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Profile updated successfully!");
        updateUser(updatedUser); // Update user globally in context
        setIsEditing(false); // Exit edit mode
      } else {
        alert("Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating your profile.");
    }
  };


  // Inside your component return:
  return (
    <div className={classes.con}>
      <div className={classes.profileContainer}>
        <h2 className={classes.heading}>
          {user?.role === "admin" ? <UserCog size={28} /> :
            user?.role === "retailer" ? <Store size={28} /> :
              <Sprout size={28} />}
          Profile
        </h2>

        {user ? (
          <div className={classes.profileDetails}>
            <p><strong>First Name:</strong> {isEditing ? (
              <input type="text" name="firstname" value={updatedUser.firstname} onChange={handleChange} />
            ) : user.firstname}</p>

            <p><strong>Last Name:</strong> {isEditing ? (
              <input type="text" name="lastname" value={updatedUser.lastname} onChange={handleChange} />
            ) : user.lastname}</p>

            <p><strong>Phone:</strong> {isEditing ? (
              <input type="text" name="phone" value={updatedUser.phone} onChange={handleChange} />
            ) : user.phone}</p>

            {user.role === "farmer" && (
              <p><strong>Address:</strong> {isEditing ? (
                <input type="text" name="address" value={updatedUser.address} onChange={handleChange} />
              ) : user.address}</p>
            )}

            {user.role === "retailer" && (
              <>
                <p><strong>Shop Name:</strong> {isEditing ? (
                  <input type="text" name="shop_name" value={updatedUser.shop_name} onChange={handleChange} />
                ) : user.shop_name}</p>

                <p><strong>Shop Address:</strong> {isEditing ? (
                  <input type="text" name="shop_address" value={updatedUser.shop_address} onChange={handleChange} />
                ) : user.shop_address}</p>
              </>
            )}

            <p><strong>Role:</strong> {user.role}</p>

            <div className={classes.buttonRow}>
              {isEditing ? (
                <>
                  <button onClick={handleUpdateProfile} className={classes.saveButton}>Save Changes</button>
                  <button onClick={() => {
                      setIsEditing(false);
                      setUpdatedUser({...user}); // revert
                    }} className={classes.cancelButton}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className={classes.editButton}>Edit Profile</button>
              )}

              <button onClick={goToDashboard} className={classes.dashboardButton}>Go to Dashboard</button>
              <button onClick={logout} className={classes.logoutButton}>Logout</button>
            </div>
          </div>
        ) : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default Profile;
