import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    region: "",
  });

  const [file, setFile] = useState(null); // selected image file
  const [preview, setPreview] = useState(null); // preview URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("region", formData.region);
    data.append("profile_pic", file);

    try {
      await axios.post("http://localhost:5002/api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register
        </h2>

        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a region</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            name="profile_pic"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full text-gray-700"
          />
        </div>

        {preview && (
          <div className="flex justify-center mt-2">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold transition duration-200"
        >
          Register
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full border border-blue-500 text-blue-500 py-2 rounded font-semibold hover:bg-blue-50 transition duration-200"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;
