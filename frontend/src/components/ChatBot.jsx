// src/components/ChatBot.jsx
import { useState } from "react";
import { fetchChatbotReply } from "../api/chatbotAPI";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botReply = await fetchChatbotReply(input);
    const botMessage = { sender: "bot", text: botReply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="max-w-xl mx-auto p-4 shadow-lg rounded-xl bg-white dark:bg-gray-900 h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
