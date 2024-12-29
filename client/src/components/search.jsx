import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const baseUrl = "http://localhost:3002";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/search`, { params: { query } });
      setResults(response.data.data || []);
    } catch (error) {
      console.error("Failed to search:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="bg-red-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Search</h1>
      </header>
      <main className="container mx-auto">
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleEnterKey}
            placeholder="Search by category or user..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="ml-2 p-2 bg-red-500 text-white rounded"
          >
            <FaSearch />
          </button>
        </div>

        {loading ? (
          <p className="mt-4">Loading...</p>
        ) : (
          <div className="mt-4 space-y-4">
            {results.length === 0 ? (
              <p>No results found.</p>
            ) : (
              results.map((item) => (
                <div key={item._id} className="bg-white p-4 shadow rounded">
                  <Link to={`/post/${item._id}`}>
                    <h3 className="text-lg font-bold text-red-600">{item.title || item.name}</h3>
                  </Link>
                  <p className="text-gray-600">{item.description || item.text}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
