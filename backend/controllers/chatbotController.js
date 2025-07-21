import fetch from "node-fetch";
import Chat from "../models/Chat.js";

const generateReply = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        const response = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "command-r-plus",
                prompt: message,
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        console.log("Cohere Full Response:", JSON.stringify(data, null, 2));

        // Check if there's an error message
        if (data.message || data.error) {
            return res.status(500).json({ error: data.message || data.error });
        }

        if (!data.generations || !Array.isArray(data.generations) || data.generations.length === 0) {
            return res.status(500).json({ error: "No generations returned from Cohere." });
        }

        const reply = data.generations[0].text?.trim() || "No response generated.";

        // Save to MongoDB
        await Chat.create({ message, reply });

        res.status(200).json({ reply });
    } catch (err) {
        console.error("Cohere API Error:", err.message);
        res.status(500).json({ error: "Failed to get response from Cohere." });
    }
};

const getChatHistory = async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: 1 }).limit(50); // limit to last 50
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history." });
    }
};

export { generateReply, getChatHistory }