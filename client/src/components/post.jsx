import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FaCamera } from "react-icons/fa";

const baseUrl = "http://localhost:3002";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [category, setCategory] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
    },
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!postText && postImages.length === 0) {
      alert("Please provide either text or at least one image for the post.");
      setLoading(false);
      return;
    }

    const postData = {
      text: postText || undefined,
      description: postDescription || undefined,
      category,
      post_images: postImages,
    };

    try {
      const response = await axios.post(`${baseUrl}/addPost`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-50 p-4">
        <h1 className="text-3xl font-bold text-red-500">Create a New Post</h1>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Text Area */}
            <div>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="What's on your mind?"
                rows="4"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              ></textarea>
            </div>

            {/* Post Description */}
            <div>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Post description"
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
              />
            </div>

            {/* Category Selection */}
            <div>
              <select
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Fitness">Fitness</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="cursor-pointer">
                <div
                  {...getRootProps()}
                  className="bg-gray-100 p-4 rounded-lg border-dashed border-2 border-gray-400 text-center"
                >
                  <FaCamera className="text-3xl text-gray-500 mb-2" />
                  <span className="text-gray-500">Click or drag to add images</span>
                </div>
                <input {...getInputProps()} />
              </label>

              {/* Image Preview Section */}
              {postImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {postImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPostImages(postImages.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
