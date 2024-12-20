import  { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart ,faComment } from '@fortawesome/free-regular-svg-icons';

const Home = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-red00">InterestNet</h1>
          <nav className="space-x-6">
            <a href="#" className="text-gray-600 hover:text-red-500">Home</a>
            <a href="#" className="text-gray-600 hover:text-red-500">Explore</a>
            <a href="#" className="text-gray-600 hover:text-red-500">Notifications</a>
            <a href="#" className="text-gray-600 hover:text-red-500">Profile</a>
          </nav>
        </div>
      </header>

      {/* Banner Section */}
      <section className="relative bg-red-700 text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">Welcome to InterestNet</h2>
            <p className="text-lg mb-6">
              Connect with people who share your passions and discover groups tailored to your interests.
            </p>
            <button className="px-6 py-3 bg-white text-red-500 font-semibold rounded shadow hover:bg-gray-100">
              Get Started
            </button>
          </div>
          <div className="md:w-1/4">
            <img
              src="public/people.jpg"
              alt="Community Banner"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Interests</h2>
          <ul className="space-y-2">
            <li className="text-gray-600 hover:text-red-500 cursor-pointer">Photography</li>
            <li className="text-gray-600 hover:text-red-500 cursor-pointer">Travel</li>
            <li className="text-gray-600 hover:text-red-500 cursor-pointer">Music</li>
            <li className="text-gray-600 hover:text-red-500 cursor-pointer">Fitness</li>
            <li className="text-gray-600 hover:text-red-500 cursor-pointer">Technology</li>
          </ul>
        </aside>

        {/* Feed Section */}
        <section className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Create a Post</h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="What's on your mind?"
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Post
              </button>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Feed</h2>
          <div className="space-y-6">
            {/* Post Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <img
                  src="public/interest.webp"
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="text-gray-800 font-semibold">John Doe</h3>
                  <p className="text-gray-500 text-sm">2 hours ago</p>
                </div>
              </div>
              <p className="text-gray-700">Check out my latest sunset shot!</p>
              <img
                src="public/interest.webp"
                alt="Post content"
                className="mt-4 rounded-lg"
              />
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={toggleLike} 
                  className={`text-2xl ${liked ? 'text-red-600' : 'text-gray-600'} hover:text-red-500`}
                >
                  <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
                </button>
                <button className="text-black ">
                <FontAwesomeIcon className='h-5' icon={faComment} />
                  </button>
              </div>
            </div>

            {/* Another Post Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="text-gray-800 font-semibold">Jane Smith</h3>
                  <p className="text-gray-500 text-sm">5 hours ago</p>
                </div>
              </div>
              <p className="text-gray-700">What are your favorite albums of the year?</p>
              <div className="mt-4 flex justify-between items-center">
                <button 
                  onClick={toggleLike} 
                  className={`text-2xl ${liked ? 'text-red-600' : 'text-gray-600'} hover:text-red-500`}
                >
                  <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
                </button>
                <button className="text-black"><FontAwesomeIcon className='h-5' icon={faComment} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Groups */}
        <aside className="hidden md:block w-1/4 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Suggested Groups</h2>
          <div className="space-y-4">
            {/* Group Card */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-800 font-semibold">Travel Adventures</h3>
                <p className="text-gray-600 text-sm">Discover and share travel stories.</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Join</button>
            </div>

            {/* Another Group Card */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-800 font-semibold">Fitness Fans</h3>
                <p className="text-gray-600 text-sm">Stay fit and share your workouts.</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Join</button>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 InterestNet. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
