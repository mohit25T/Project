import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react"; // Import the Heart icon from Lucide

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false); // State to manage comment modal visibility
  const [currentPostId, setCurrentPostId] = useState(null); // To keep track of the post for which comment modal is open
  const [comment, setComment] = useState(""); // Comment text
  const [comments, setComments] = useState([]); // Comments for the current post
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/posts", {
        withCredentials: true,
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5002/api/posts/${postId}/like`,
        {},
        { withCredentials: true }
      );
      setPosts(
        posts.map((post) =>
          post._id === postId
            ? { ...post, likes: response.data.likesCount }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleComment = async (postId) => {
    setShowCommentModal(true); // Open the comment modal
    setCurrentPostId(postId); // Set the current post id to associate with the comment

    // Fetch comments for this post
    try {
      const response = await axios.get(
        `http://localhost:5002/api/posts/${postId}/comments`,
        { withCredentials: true }
      );
      setComments(response.data); // Set the comments for the post
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return; // Don't submit empty comments

    try {
      // Submit the comment
      const response = await axios.put(
        `http://localhost:5002/api/posts/${currentPostId}/comment`,
        { text: comment },
        { withCredentials: true }
      );

      // Add the new comment to the list of comments
      setComments((prevComments) => [response.data, ...prevComments]);

      // Close the comment modal and reset comment state
      setShowCommentModal(false);
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        All Posts
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden"
            >
              {/* User Info */}
              <Link
                to={
                  currentUser && post.user?._id === currentUser._id
                    ? "/profile" // Your own post = your profile
                    : `/user/${post.user?._id}` // Someone else's = their profile
                }
                className="flex items-center space-x-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <img
                  src={`http://localhost:5002/uploads/profiles/${post.user?.profilePicture}`}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {post.user?.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.region}
                  </p>
                </div>
              </Link>

              {/* Post Image */}
              {post.image && (
                <img
                  src={`http://localhost:5002/uploads/posts/${post.image}`}
                  alt="post"
                  className="w-full max-h object-cover"
                />
              )}

              {/* Caption */}
              <div className="p-4 text-gray-800 dark:text-gray-200">
                <p>{post.caption}</p>
              </div>

              {/* Like and Comment Buttons */}
              <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
                  >
                    <Heart size={20} className="text-red-500" />
                    <span>Like ({post.likes?.length || 0})</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => handleComment(post._id)}
                    className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 8h10M7 12h10M7 16h10"
                      />
                    </svg>
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Comments
            </h2>

            {/* Display Comments */}
            <div className="max-h-60 overflow-y-auto mb-4">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                >
                  <p className="text-gray-800 dark:text-white font-semibold">
                    {comment.user?.name || "Unknown User"}:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Add New Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
              rows="4"
              placeholder="Write your comment..."
            ></textarea>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowCommentModal(false)} // Close the modal without submitting
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
