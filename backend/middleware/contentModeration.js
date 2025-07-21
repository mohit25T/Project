// middleware/contentModeration.js
import axios from "axios";

const moderateContent = async (req, res, next) => {
  const content = req.body.content;

  try {
    const response = await axios.post('https://api.openai.com/v1/moderations', {
      input: content
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const results = response.data.results[0];
    if (results.flagged) {
      return res.status(400).json({ success: false, message: "Content is inappropriate." });
    }

    next();
  } catch (error) {
    console.error("Moderation Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to moderate content." });
  }
};

export {moderateContent};
