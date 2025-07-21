import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5002/api/events?region=Delhi"
        );
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err.message);
      }
    };
    fetchEvents();
  }, []);

  const rsvpEvent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5002/api/events/${id}/rsvp`,
        {}
      );
      alert("RSVP successful!");
    } catch (err) {
      console.error("RSVP error:", err.message);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <button
          onClick={() => navigate("/create-event")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Event
        </button>
      </div>

      {events.length === 0 && <p>No events available in your region.</p>}

      {events.map((event) => (
        <div
          key={event._id}
          className="border p-3 rounded-lg shadow-sm bg-white"
        >
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p>{event.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleString()}
          </p>
          <p className="text-sm">📍 {event.location}</p>
          <button
            onClick={() => rsvpEvent(event._id)}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            RSVP
          </button>
        </div>
      ))}
    </div>
  );
};

export default Events;
