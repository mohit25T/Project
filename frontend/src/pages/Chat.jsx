// src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/chatbot/history");
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching history:", err.message);
      }
    };
    fetchHistory();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { message: input };

    setMessages((prev) => [...prev, { message: input, reply: "..." }]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5002/api/chatbot", newMessage);
      setMessages((prev) =>
        prev.slice(0, -1).concat({ message: newMessage.message, reply: res.data.reply })
      );
    } catch (err) {
      console.error("Send error:", err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100 dark:bg-zinc-900">
      <h1 className="text-2xl font-bold mb-4 text-center text-zinc-800 dark:text-white">AI Chatbot</h1>
      <div className="flex-1 overflow-y-auto space-y-3 px-2">
        {messages.map((chat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 shadow">
              <p className="text-sm text-zinc-500">You:</p>
              <p className="text-base font-medium text-zinc-900 dark:text-white">{chat.message}</p>
              {chat.reply && (
                <>
                  <p className="text-sm text-teal-500 mt-2">AI:</p>
                  <p className="text-base text-zinc-800 dark:text-zinc-300">{chat.reply}</p>
                </>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-xl p-2 border dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
