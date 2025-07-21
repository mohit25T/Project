import { useState, useEffect } from "react";
import axios from "axios";

const PollCard = ({ poll }) => {
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);
  const [voted, setVoted] = useState(poll.hasVoted);
  // Assuming user data is stored in localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id; // or user.id depending on your schema

  const vote = async () => {
    try {
      await axios.post(`http://localhost:5002/api/polls/vote/${poll._id}`, {
        optionIndex: selected,
        userId,
      });
      setVoted(true);
      fetchResults();
    } catch (err) {
      alert("Failed to vote. Maybe you've already voted?");
    }
  };

  const fetchResults = async () => {
    const res = await axios.get(
      `http://localhost:5002/api/polls/results/${poll._id}`
    );
    setResults(res.data);
  };

  useEffect(() => {
    if (poll.hasVoted) {
      setVoted(true);
      fetchResults();
    }
  }, [poll.hasVoted]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 my-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {poll.question}
      </h3>

      {!voted ? (
        <div>
          {poll.options.map((opt, idx) => (
            <label key={idx} className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                name={`poll-${poll._id}`}
                value={idx}
                checked={selected === idx}
                onChange={() => setSelected(idx)}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {opt.text}
              </span>
            </label>
          ))}
          <button
            onClick={vote}
            disabled={selected === null}
            className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400"
          >
            Vote
          </button>
        </div>
      ) : results ? (
        <div className="space-y-2">
          {results.options.map((opt, idx) => {
            const percentage = ((opt.votes / results.totalVotes) * 100).toFixed(
              1
            );
            return (
              <div key={idx}>
                <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                  <span>{opt.text}</span>
                  <span>
                    {opt.votes} votes ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Loading results...</p>
      )}
    </div>
  );
};

export default PollCard;
