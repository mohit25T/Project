import { useState } from 'react';
import axios from 'axios';

const GeneratePoll = () => {
  const [topic, setTopic] = useState('');
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Topic is required');
      return;
    }

    setLoading(true);
    setError('');
    setPoll(null);

    try {
      const response = await axios.post('http://localhost:5002/api/polls/generate', { topic });
      setPoll(response.data.poll);
      setTopic('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Generate a New Poll</h1>
      <div className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., AI in education)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Poll'}
        </button>

        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        {poll && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{poll.question}</h2>
            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
              {poll.options.map((opt, idx) => (
                <li key={idx}>{opt.text}</li>
              ))}
            </ul>
            {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Poll saved to database.</p> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePoll;
