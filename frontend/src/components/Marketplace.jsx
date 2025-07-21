import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5002/api/marketplace", {
          params: { region, type },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching marketplace items:", err);
      }
    };
    fetchItems();
  }, [region, type]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Marketplace</h2>

      {/* Filter Options */}
      <div className="mb-4">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-2 border rounded mr-4"
        >
          <option value="">All Regions</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Types</option>
          <option value="sell">For Sale</option>
          <option value="buy">Wanted</option>
          <option value="exchange">Exchange</option>
        </select>
      </div>

      {/* Add Item Button */}
      <Link to="/create-listing" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
        + Add Listing
      </Link>

      {/* Marketplace Items */}
      {items.length === 0 && <p>No items available.</p>}
      {items.map((item) => (
        <div key={item._id} className="border p-4 rounded-lg shadow-sm bg-white mb-4">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p>{item.description}</p>
          <p className="text-sm text-gray-500">₹{item.price}</p>
          <p className="text-sm">📍 {item.region}</p>
          <p className="text-sm">Type: {item.type}</p>
        </div>
      ))}
    </div>
  );
};

export default Marketplace;
