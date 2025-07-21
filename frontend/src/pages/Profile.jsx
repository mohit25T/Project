import React, { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../api/user";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getCurrentUserProfile();
        setProfile(userData);
      } catch (error) {
        console.error("Failed to load user profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setProfile(null); // Clear the profile state
    navigate("/login");
  };
  
  if (!profile)
    return (
      <div className="p-4">
        <p className="mb-4">Loading...</p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full border border-blue-500 text-blue-500 py-2 rounded font-semibold hover:bg-blue-50 transition duration-200"
        >
          Already have an account? Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full mt-2 border border-blue-500 text-blue-500 py-2 rounded font-semibold hover:bg-blue-50 transition duration-200"
        >
          Register
        </button>
      </div>
    );

  const imageUrl = `http://localhost:5002/uploads/profiles/${profile.profile_pic}`;
  console.log("Image URL:", imageUrl);

  return (
    <div className="p-4 border rounded-md bg-white shadow-md">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover"
      />
      <h2 className="text-xl font-semibold mt-2">{profile.name}</h2>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="text-center">
          <p className="font-bold text-lg">{profile.followers?.length || 0}</p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-lg">{profile.following?.length || 0}</p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>

      <p className="text-blue-600">{profile.email}</p>
      <p className="text-gray-500">Region: {profile.region}</p>
      <p className="text-gray-400 text-sm">
        Last Login: {new Date(profile.lastLogin).toLocaleString()}
      </p>

      {/* 👇 Update Profile Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/update")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Update Profile
        </button>
      </div>

      {/* Login, Register, and Logout Buttons */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login to Another Account
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create New Account
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
