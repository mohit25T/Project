import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    region: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/auth/profile", {
          withCredentials: true,
        });
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          region: res.data.region || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Create a payload with only the fields the user has filled
    const updateData = {};
    for (let key in formData) {
      if (formData[key].trim() !== "") {
        updateData[key] = formData[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      setMessage("Please fill at least one field to update.");
      setLoading(false);
      return;
    }

    try {
      await axios.put("http://localhost:5002/api/users/update", updateData, {
        withCredentials: true,
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err.message);
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Update Your Profile</h2>

      {message && (
        <div className="mb-4 text-center text-sm text-blue-500">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Region</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
