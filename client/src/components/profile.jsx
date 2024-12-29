import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaCamera ,FaSignOutAlt} from "react-icons/fa"; // Import relevant icons

const baseUrl = "http://localhost:3002";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login"); // Redirect to login if no token is found
          return;
        }

        const response = await axios.get(`${baseUrl}/userprofile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.data); // Set user data from the response
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      {/* Profile Content */}
      <div className="container mx-auto p-4 sm:p-8 max-w-4xl w-1/3 bg-white shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome, {user.name}</h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={user.profilePicture ? `${baseUrl}/${user.profilePicture}` : "/default-profile.png"} // Fallback image
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-300 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 p-2 bg-gray-600 rounded-full cursor-pointer">
              <FaCamera className="text-white text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="text-center mb-6">
          <p className="text-xl font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="mt-2 text-gray-500">{user.bio || "No bio available"}</p>
        </div>

        {/* Edit Profile and Logout Button */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          {/* Edit Profile Button */}
          <div className="flex items-center gap-2">
            <FaEdit className="text-blue-500" />
            <button
              onClick={() => navigate("/edit-profile")}
              className="text-blue-500 hover:text-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
          {/* Logout Button */}
          <div className="flex items-center gap-2">
          <FaSignOutAlt className="text-red-500" />
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Interests Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Your Interests</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {user.interests && user.interests.length > 0 ? (
              user.interests.map((interest, index) => (
                <div
                  key={index}
                  className="bg-black text-white text-sm sm:text-md font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                >
                  {interest}
                </div>
              ))
            ) : (
              <p className="text-gray-500">You have not added any interests yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
