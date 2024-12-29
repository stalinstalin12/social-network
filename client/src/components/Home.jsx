import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaPlus, FaSearch, FaHome, FaComment, FaThumbsUp } from "react-icons/fa";
import io from "socket.io-client";
import CommentModal from "./comment";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:3002";
const socket = io(baseUrl);

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true);
        try {
          const response = await axios.get(`${baseUrl}/userprofile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfilePicture(response.data.data.profilePicture);
        } catch (error) {
          console.error("Failed to fetch profile picture:", error.message);
        }
      } else {
        setIsLoggedIn(false);
      }
      setAuthLoading(false);
    };

    fetchProfilePicture();
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.warning("Please log in to view the home page.");
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        const postsRoute = token ? "/viewPostsForUser" : "/viewPosts";
        const response = await axios.get(`${baseUrl}${postsRoute}`, { headers });

        const postsData = response.data.data || [];
        const enrichedPosts = token
          ? await Promise.all(
              postsData.map(async (post) => {
                try {
                  const userResponse = await axios.get(`${baseUrl}/user/${post.userId}`);
                  const userData = userResponse.data.data[0];

                  const commentCountResponse = await axios.get(`${baseUrl}/comments/count/${post._id}`, { headers });
                  const commentCount = commentCountResponse.data.count;

                  return {
                    ...post,
                    userName: userData?.name || "Unknown User",
                    userProfileImage: userData?.profilePicture
                      ? `${baseUrl}/${userData.profilePicture}`
                      : "https://via.placeholder.com/40",
                    commentCount,
                  };
                } catch (error) {
                  console.error("Failed to fetch user details:", error.message);
                  return post;
                }
              })
            )
          : postsData;

        setPosts(enrichedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isLoggedIn) {
      fetchPosts();
    }
  }, [authLoading, isLoggedIn, navigate]);

  useEffect(() => {
    socket.on("commentAdded", (newCommentData) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === newCommentData.postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
    });

    return () => {
      socket.off("commentAdded");
    };
  }, []);

  const handleLikeToggle = async (postId, isLiked) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You must be logged in to like posts!");
      return;
    }

    try {
      const action = isLiked ? "unlike" : "like";
      console.log(action)
      const response = await axios.post(
        `${baseUrl}/post/${postId}/toggleLike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likeCount: response.data.likeCount, isLiked: !isLiked }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to toggle like:", error.message);
    }
  };

  const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setSelectedPostId(null);
    setCommentModalOpen(false);
  };

  if (authLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-red-600 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-red-100">InterestNet</h1>

          <nav className="flex-1 flex justify-center items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-red-500 transition-colors">
              <FaHome className="text-xl rounded text-white" />
              <p>Home</p>
            </Link>
            <Link to="/search" className="text-gray-600 hover:text-red-500 transition-colors">
              <FaSearch className="text-xl rounded text-white" />
              <p>Find</p>
            </Link>
            <Link to="/Post" className="text-gray-600 hover:text-red-500 transition-colors">
              <FaPlus className="text-xl border-white border rounded text-white" />
              <p>Create</p>
            </Link>
          </nav>

          <div>
            {isLoggedIn ? (
              <Link to="/profile" className="block">
                <img
                  src={`${baseUrl}/${profilePicture}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border object-cover border-gray-300 shadow"
                />
              </Link>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2">
                <FaUser className="text-2xl" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 flex gap-6">
        <section className="flex-1">
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white p-4 shadow rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Link to={`/user/${post.userId}`} className="block">
                      <img
                        src={post.userProfileImage}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <div>
                      <h3 className="text-gray-800 font-semibold">{post.userName}</h3>
                      <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-800">{post.text}</p>
                  {post.post_images && post.post_images.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {post.post_images.map((image, index) => (
                        <img
                          key={index}
                          src={`${baseUrl}/${image}`}
                          alt={`Post ${index + 1}`}
                          className="w-1/3 h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="text-gray-600 hover:text-red-500 flex items-center"
                      onClick={() => handleLikeToggle(post._id, post.isLiked)}
                    >
                      <FaThumbsUp className={`text-lg ${post.isLiked ? "text-red-500" : "text-black"}`} />
                      <span className="ml-2">{post.likeCount}</span>
                    </button>
                    <button
                      className="text-gray-600 hover:text-red-500 flex items-center"
                      onClick={() => openCommentModal(post._id)}
                    >
                      <FaComment className="text-black" />
                      <span className="ml-2">{post.commentCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CommentModal isOpen={isCommentModalOpen} postId={selectedPostId} onClose={closeCommentModal} />
    </div>
  );
};

export default Home;
