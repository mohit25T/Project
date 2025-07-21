import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [region, setRegion] = useState("");

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !region) {
      alert("Image and region are required.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);
    formData.append("region", region);

    try {
      await axios.post("http://localhost:5002/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Post created!");
      setCaption("");
      setFile(null);
      setPreview(null);
      setRegion("");
    } catch (error) {
      console.error("❌ Error posting:", error);
      alert(error.response?.data?.message || "Failed to post");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select your region</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded mx-auto"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
