import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Modals and lists
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Failed to load user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const checkFollowStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5002/api/friends/follow-status/${id}`,
          { withCredentials: true }
        );
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error("Failed to check follow status:", error.message);
      } finally {
        setCheckingStatus(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5002/api/posts/user/${id}`,
          { withCredentials: true }
        );
        setUserPosts(res.data);
      } catch (error) {
        console.error("Failed to load user posts:", error.message);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserProfile();
    checkFollowStatus();
    fetchUserPosts();
  }, [id]);

  const handleToggleFollow = async () => {
    setButtonLoading(true);
    try {
      if (isFollowing) {
        await axios.post(
          `http://localhost:5002/api/friends/unfollow/${id}`,
          {},
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `http://localhost:5002/api/friends/follow/${id}`,
          {},
          { withCredentials: true }
        );
      }

      const statusRes = await axios.get(
        `http://localhost:5002/api/friends/follow-status/${id}`,
        { withCredentials: true }
      );
      setIsFollowing(statusRes.data.isFollowing);

      const userRes = await axios.get(`http://localhost:5002/api/users/${id}`, {
        withCredentials: true,
      });
      setUser(userRes.data);
    } catch (error) {
      console.error("Failed to toggle follow:", error.message);
    } finally {
      setButtonLoading(false);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/friends/followers/${id}`,
        { withCredentials: true }
      );
      setFollowersList(res.data.followers); // ✅ if your backend wraps in an object
      setShowFollowersModal(true);
    } catch (error) {
      console.error("Failed to fetch followers:", error.message);
    }
  };

  const fetchFollowing = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/friends/following/${id}`,
        { withCredentials: true }
      );
      setFollowingList(res.data.following); // ✅ if your backend wraps in an object
      setShowFollowingModal(true);
    } catch (error) {
      console.error("Failed to fetch following:", error.message);
    }
  };

  if (loading || checkingStatus) return <p className="p-4">Loading...</p>;
  if (!user) return <p className="p-4 text-red-500">User not found</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={`http://localhost:5002/uploads/profiles/${user.profile_pic}`}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.region}</p>
        </div>
      </div>

      <div className="flex gap-6 text-sm text-gray-700 cursor-pointer">
        <p onClick={fetchFollowers}>
          <strong>Followers:</strong> {user.followersCount}
        </p>
        <p onClick={fetchFollowing}>
          <strong>Following:</strong> {user.followingCount}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleToggleFollow}
          disabled={buttonLoading}
          className={`px-4 py-2 rounded ${
            isFollowing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white disabled:opacity-50`}
        >
          {buttonLoading
            ? isFollowing
              ? "Unfollowing..."
              : "Following..."
            : isFollowing
            ? "Unfollow"
            : "Follow"}
        </button>

        <Link
          to={`/chat/${user._id}`}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white inline-block"
        >
          Chat
        </Link>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-2">
          {user.name}'s Posts
        </h3>

        {postsLoading ? (
          <p>Loading posts...</p>
        ) : userPosts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid gap-4">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="border rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm"
              >
                {post.image && (
                  <img
                    src={`http://localhost:5002/uploads/posts/${post.image}`}
                    alt="Post"
                    className="w-full h-60 object-cover rounded-md mb-3"
                  />
                )}
                <p className="text-gray-800 dark:text-gray-200">
                  {post.caption}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  Likes: {post.likes?.length || 0}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto relative">
            <h4 className="text-lg font-semibold mb-4">Followers</h4>
            <button
              className="absolute top-2 right-3 text-red-500"
              onClick={() => setShowFollowersModal(false)}
            >
              ✕
            </button>
            {followersList.length === 0 ? (
              <p className="text-gray-500">No followers yet.</p>
            ) : (
              <ul className="space-y-2">
                {followersList.map((follower) => (
                  <li key={follower._id} className="flex items-center gap-3">
                    <Link
                      to={`/user/${follower._id}`}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                      onClick={() => setShowFollowersModal(false)}
                    >
                      <img
                        src={`http://localhost:5002/uploads/profiles/${follower.profilePicture}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{follower.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto relative">
            <h4 className="text-lg font-semibold mb-4">Following</h4>
            <button
              className="absolute top-2 right-3 text-red-500"
              onClick={() => setShowFollowingModal(false)}
            >
              ✕
            </button>
            {followingList.length === 0 ? (
              <p className="text-gray-500">Not following anyone yet.</p>
            ) : (
              <ul className="space-y-2">
                {followingList.map((following) => (
                  <li key={following._id} className="flex items-center gap-3">
                    <Link
                      to={`/user/${following._id}`}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                      onClick={() => setShowFollowersModal(false)}
                    >
                      <img
                        src={`http://localhost:5002/uploads/profiles/${following.profilePicture}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{following.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
