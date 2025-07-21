import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    region: "",
    type: "sell",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5002/api/marketplace", formData);
      alert("Listing created successfully!");
      navigate("/marketplace");
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Failed to create listing.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border rounded"
        />
        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Region</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </select>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="sell">For Sale</option>
          <option value="buy">Wanted</option>
          <option value="exchange">Exchange</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
