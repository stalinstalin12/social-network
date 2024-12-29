import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002");
const baseUrl = "http://localhost:3002";
let token = localStorage.getItem("authToken");

const UserPage = () => {
  const { userId } = useParams(); // Get userId from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // Tracks if the current user is following this user
  const [followersCount, setFollowersCount] = useState(0); // Tracks the followers count
  const [error, setError] = useState(null); // Tracks errors
  const [followMessage, setFollowMessage] = useState(null); // Tracks the follow/unfollow message

  // Effect for fetching user details and posts
  useEffect(() => {
    const fetchUserDetailsAndPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${baseUrl}/userandpost/${userId}`);
        if (response.data) {
          setUserDetails(response.data.user || {});
          setPosts(response.data.posts || []);
          const followStatus = response.data.user?.isFollowing || false;
          setIsFollowing(followStatus);
          setFollowersCount(response.data.user?.followers?.length || 0);

          // Persist the follow status in localStorage
          localStorage.setItem(`isFollowing-${userId}`, followStatus);
        } else {
          throw new Error("Invalid response data");
        }
      } catch (error) {
        setError("Failed to load user details or posts");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetailsAndPosts();

    // Listen for real-time updates on follow/unfollow actions
    socket.on("updateFollowers", ({ updatedUserId, change }) => {
      if (userId === updatedUserId) {
        setFollowersCount((prev) => prev + change);
      }
    });

    // Listen for follow/unfollow events
    socket.on("follow", (data) => {
      if (data.userId === userId) {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
      }
  });
  
  socket.on("unfollow", (data) => {
      if (data.userId === userId) {
          setIsFollowing(false);
          setFollowersCount(prev => prev - 1);
      }
  });
  

    return () => {
      // Clean up the socket listeners
      socket.off("updateFollowers");
      socket.off("follow");
      socket.off("unfollow");
    };
  }, [userId]);

  // Set follow state from localStorage when the page reloads
  useEffect(() => {
    const persistedFollowStatus = localStorage.getItem(`isFollowing-${userId}`);
    if (persistedFollowStatus !== null) {
      setIsFollowing(persistedFollowStatus === "true");
    }
  }, [userId]);

  // Handle follow action
  const handleFollow = async () => {
    if (isFollowing) {
      setFollowMessage("You are already following this user."); // Display message if already following
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsFollowing(true); // Update follow state
        setFollowersCount((prev) => prev + 1); // Increment followers count
        setFollowMessage("Successfully followed the user.");
        localStorage.setItem(`isFollowing-${userId}`, true); // Persist follow status

        // Emit follow event to server
        socket.emit("follow", { userId, followerId: response.data.followerId });
      }
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/unfollow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsFollowing(false); // Update follow state
        setFollowersCount((prev) => prev - 1); // Decrement followers count
        setFollowMessage("Successfully unfollowed the user.");
        localStorage.setItem(`isFollowing-${userId}`, false); // Persist unfollow status

        // Emit unfollow event to server
        socket.emit("unfollow", { userId, followerId: response.data.followerId });
      }
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600 text-xl">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10">
          {/* Profile Picture */}
          <img
            src={`${baseUrl}/${userDetails.profilePicture || "default-profile.jpg"}`}
            alt={`${userDetails.name}'s profile`}
            className="w-32 h-32 rounded-full border-2 border-red-400 object-cover shadow-lg"
          />
          {/* User Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">
                {userDetails.name || "Anonymous"}
              </h1>
              {isFollowing ? (
                <button
                  onClick={handleUnfollow}
                  className="px-4 py-2 text-sm text-white bg-gray-500 rounded-full hover:bg-gray-600"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded-full hover:bg-red-600"
                >
                  Follow
                </button>
              )}
            </div>
            <div className="flex justify-center md:justify-start space-x-8 text-gray-600">
              <p>
                <span className="font-semibold">{posts.length}</span> Posts
              </p>
              <p>
                <span className="font-semibold">{followersCount}</span> Followers
              </p>
              <p>
                <span className="font-semibold">
                  {userDetails.following?.length || 0}
                </span>{" "}
                Following
              </p>
            </div>
            <p className="text-gray-600 mt-4">
              {userDetails.bio || "No bio available"}
            </p>
          </div>
        </div>
      </div>

      {/* Follow/Unfollow Message */}
      {followMessage && (
        <div className="bg-yellow-200 text-gray-800 p-4 text-center">
          <p>{followMessage}</p>
        </div>
      )}

      {/* Posts Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4">
          {posts.length === 0 ? (
            <p className="col-span-3 text-center text-gray-600">
              No posts available.
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="relative bg-white rounded-lg shadow p-4"
              >
                {/* Post Content */}
                <p className="text-gray-800 mb-2">{post.text}</p>
                {post.post_images && post.post_images.length > 0 && (
                  <ImageCarousel images={post.post_images} />
                )}
                <p className="text-gray-800 mb-2">{post.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ImageCarousel Component
 * Displays images in a carousel with arrow buttons.
 */
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      {/* Current Image */}
      <img
        src={`${baseUrl}/${images[currentIndex]}`}
        alt={`Image ${currentIndex + 1}`}
        className="w-full h-64 object-cover rounded-lg"
      />

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
      >
        <FaArrowLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // Ensure images is a required array of strings
};

export default UserPage;
