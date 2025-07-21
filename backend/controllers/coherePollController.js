import axios from 'axios';
import Poll from '../models/Poll.js';

const generatePollWithCohere = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ success: false, message: "Topic is required" });
  }

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: `Create a poll question with 4 multiple choice options about: ${topic}`,
        max_tokens: 100,
        temperature: 0.8
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const pollText = response.data.generations[0].text.trim();

    // Parse pollText into question and options
    const lines = pollText.split('\n').filter(Boolean);
    const question = lines[0];
    const options = lines.slice(1, 5).map(line => ({
      text: line.replace(/^[A-Da-d]\.?\s*/, '').trim()
    }));


    if (options.length < 4) {
      return res.status(400).json({ success: false, message: "Cohere did not return 4 options" });
    }
    // Save poll to MongoDB
    const newPoll = new Poll({ question, options });
    await newPoll.save();

    res.status(200).json({ success: true, poll: newPoll });

  } catch (err) {
    console.error("Cohere API Error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to generate poll using Cohere" });
  }
};

const getAllPolls = async (req, res) => {
  const { userId } = req.query;

  try {
    const polls = await Poll.find().sort({ createdAt: -1 });

    const enhancedPolls = polls.map(poll => {
      const userVote = poll.votes.find(vote => vote.userId === userId);
      return {
        _id: poll._id,
        question: poll.question,
        options: poll.options,
        createdAt: poll.createdAt,
        hasVoted: !!userVote,
        userVote: userVote ? userVote.optionIndex : null,
        votes: poll.votes, // <-- Add this line
      };
    });


    res.status(200).json({ success: true, polls: enhancedPolls });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching polls" });
  }
};

const votePoll = async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex, userId } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    // Optional: prevent multiple votes per user
    const alreadyVoted = poll.votes.some(vote => vote.userId === userId);
    if (alreadyVoted) {
      return res.status(400).json({ success: false, message: 'User has already voted' });
    }

    // Add the vote
    poll.votes.push({ optionIndex, userId });
    await poll.save();

    res.status(200).json({ success: true, message: 'Vote recorded' });
  } catch (err) {
    console.error('Vote Error:', err);
    res.status(500).json({ success: false, message: 'Failed to vote' });
  }
};

const getPollResults = async (req, res) => {
  const { pollId } = req.params;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    const results = Array(poll.options.length).fill(0);
    poll.votes.forEach(vote => {
      if (results[vote.optionIndex] !== undefined) {
        results[vote.optionIndex]++;
      }
    });

    res.status(200).json({
      success: true,
      question: poll.question,
      options: poll.options.map((opt, idx) => ({
        text: opt.text,
        votes: results[idx],
      })),
      totalVotes: poll.votes.length
    });

  } catch (err) {
    console.error("Poll Result Error:", err);
    res.status(500).json({ success: false, message: 'Failed to get poll results' });
  }
};


export { generatePollWithCohere, getAllPolls, votePoll, getPollResults }