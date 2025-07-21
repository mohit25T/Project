import { useEffect, useState } from "react";
import axios from "axios";
import PollCard from "../components/PollCard";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const userId = localStorage.getItem("userId"); // Update this based on your auth system

  useEffect(() => {
    const fetchPolls = async () => {
      const res = await axios.get(`http://localhost:5002/api/polls`);
      setPolls(res.data.polls);
    };
    fetchPolls();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Polls</h1>
      {polls.map(poll => (
        <PollCard key={poll._id} poll={poll} userId={userId} />
      ))}
    </div>
  );
};

export default Polls;
