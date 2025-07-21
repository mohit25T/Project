import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle } from "lucide-react"; // Using BarChart as the icon
import { useState } from "react";
import logo from "../assets/image.png";

const Header = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Function to close the sidebar and navigate to the page
  const handleNavigation = (path) => {
    setSidebarOpen(false); // Close the sidebar
    navigate(path); // Navigate to the specified path
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-slate-900 shadow-lg fixed top-0 left-0 w-full z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button className="flex items-center justify-center text-slate-100 text-2xl font-bold tracking-tight hover:text-indigo-400 transition-colors">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              Local Link
            </button>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <button
                className="relative text-slate-300 hover:text-indigo-400 transition-colors"
                aria-label="Notifications"
                onClick={() => handleNavigation("/notifications")}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1"></span>
              </button>

              {/* Chat Icon */}
              <button
                onClick={() => handleNavigation("/chats")}
                className="text-slate-300 hover:text-indigo-400 transition-colors"
                aria-label="Chat"
              >
                <MessageCircle size={20} />
              </button>

              {/* Sidebar Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="text-slate-300 hover:text-indigo-400 transition-colors"
                aria-label="Toggle Sidebar"
              >
                <span className="material-icons">menu</span>{" "}
                {/* Material Icon for menu */}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Backdrop for Sidebar */}
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className="fixed top-0 right-0 w-64 bg-slate-800 text-white h-full z-50"
        initial={{ x: "100%" }}
        animate={{ x: isSidebarOpen ? "0%" : "100%" }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Menu</h2>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => handleNavigation("/events")}
                className="hover:text-indigo-400 transition-colors"
              >
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/marketplace")}
                className="hover:text-indigo-400 transition-colors"
              >
                Marketplace
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/polls")}
                className="hover:text-indigo-400 transition-colors"
              >
                Polls
              </button>
            </li>
          </ul>
        </div>
      </motion.div>
    </>
  );
};

export default Header;
