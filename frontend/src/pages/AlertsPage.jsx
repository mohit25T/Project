import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaUserPlus, FaPenFancy } from "react-icons/fa";

const AlertsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/notifications", {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5002/api/notifications/${id}`, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err.message);
    }
  };

  if (loading) return <p className="p-4">Loading notifications...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Alerts</h2>

      {notifications.length === 0 ? (
        <p>No alerts yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="flex items-center gap-4 bg-gray-100 rounded-lg p-3 shadow"
            >
              <img
                src={`http://localhost:5002/uploads/profiles/${notif.sender?.profilePicture}`}
                alt="Sender"
                className="w-12 h-12 rounded-full object-cover border"
              />

              <div className="flex-1">
                <p className="text-sm">
                  <Link
                    to={`/user/${notif.sender?._id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {notif.sender?.name}
                  </Link>{" "}
                  {notif.type === "follow" && (
                    <>
                      <span className="inline-flex items-center gap-1">
                        followed you <FaUserPlus className="text-green-500" />
                      </span>
                    </>
                  )}
                  {notif.type === "post" && (
                    <>
                      <span className="inline-flex items-center gap-1">
                        created a new post{" "}
                        <FaPenFancy className="text-purple-500" />
                      </span>
                    </>
                  )}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(notif._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
