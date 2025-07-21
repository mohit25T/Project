// src/pages/ChatList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChatList = () => {
  const navigate = useNavigate();

  const chatOptions = [
    {
      title: "AI Chatbot",
      description: "Talk to our AI assistant",
      path: "/chat/ai",
    },
    // You can add more options here if needed
  ];

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100 dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-zinc-800 dark:text-white">
        Chat Options
      </h1>
      <div className="space-y-4">
        {chatOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <button
              onClick={() => navigate(option.path)}
              className="w-full text-left bg-white dark:bg-zinc-800 p-4 rounded-xl shadow hover:shadow-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
            >
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">{option.title}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{option.description}</p>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
