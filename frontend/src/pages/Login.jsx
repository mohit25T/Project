import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingUser = localStorage.getItem("loggedInUserEmail");
    if (existingUser && existingUser === formData.email) {
      // Show confirmation modal instead of redirect
      setPendingLoginData(formData);
      setShowModal(true);
      return;
    }

    await loginUser(formData);
  };

  const loginUser = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5002/api/auth/login",
        data,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("loggedInUserEmail", res.data.email);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleConfirmLogin = () => {
    if (pendingLoginData) {
      loginUser(pendingLoginData);
    }
    setShowModal(false);
  };

  const handleCancelLogin = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-md mx-auto mt-50 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="block w-full mb-3 p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="block w-full mb-4 p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full border border-green-500 text-green-500 py-2 rounded font-semibold hover:bg-green-50 transition duration-200 mt-2"
        >
          Don’t have an account? Register
        </button>
      </form>

      {/* 🔘 Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <h3 className="text-lg font-semibold mb-3">
              Account Already Exists
            </h3>
            <p className="mb-4 text-sm text-gray-700">
              This account is already logged in on this device. Do you still
              want to proceed?
            </p>
            <div className="flex justify-between gap-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded w-1/2 hover:bg-red-600"
                onClick={handleCancelLogin}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded w-1/2 hover:bg-green-600"
                onClick={handleConfirmLogin}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
