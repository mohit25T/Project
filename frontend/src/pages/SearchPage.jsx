import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        setResults([]);
        setNoResults(false);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5002/api/search/users?name=${query}`,
          {
            withCredentials: true,
          }
        );

        setResults(res.data);
        setNoResults(res.data.length === 0);
      } catch (error) {
        setResults([]);
        setNoResults(true);
        console.error("Search error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 400); // Debounce input

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name..."
        className="w-full p-2 border rounded bg-gray-100 mb-4"
      />

      {loading && <p>Loading...</p>}

      {!loading && noResults && <p>No users found.</p>}

      <div className="space-y-3">
        {results.map((user) => (
          <Link to={`/user/${user._id}`} key={user._id}>
            <div className="p-3 border rounded shadow-sm flex items-center gap-4 bg-white hover:bg-gray-100">
              <img
                src={`http://localhost:5002/uploads/profiles/${user.profile_pic}`}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.region}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
