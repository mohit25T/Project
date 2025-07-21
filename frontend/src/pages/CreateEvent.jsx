import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ <-- this was missing

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    region: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your JWT if needed
      const token = localStorage.getItem("token");
      console.log("JWT Token:", token);

      const res = await axios.post("http://localhost:5002/api/events", formData, { });
      alert("Event created!");
      navigate("/events");
    } catch (err) {
      console.error("Create event error:", err);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "description", "location", "region"].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        ))}
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
