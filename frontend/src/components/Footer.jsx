import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaSearch, FaPlusCircle, FaPoll } from "react-icons/fa"; // Added FaPoll icon

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around items-center py-2 border-t z-50">
      <Link
        to="/dashboard"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <FaHome size={20} />
        <span className="text-xs">Home</span>
      </Link>

      <Link
        to="/create-post"
        className="flex flex-col items-center text-gray-600 hover:text-green-600"
      >
        <FaPlusCircle size={24} />
        <span className="text-xs">Post</span>
      </Link>

      <Link
        to="/search"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <FaSearch size={20} />
        <span className="text-xs">Search</span>
      </Link>

      {/* New Generate Poll Button */}
      <Link
        to="/generate"
        className="flex flex-col items-center text-gray-600 hover:text-purple-600"
      >
        <FaPoll size={20} />
        <span className="text-xs">Generate Poll</span>
      </Link>

      <Link
        to="/profile"
        className="flex flex-col items-center text-gray-600 hover:text-blue-600"
      >
        <FaUser size={20} />
        <span className="text-xs">Profile</span>
      </Link>
    </footer>
  );
};

export default Footer;
