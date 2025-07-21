import MarketplaceItem from "../models/MarketplaceItem.js";

export const createItem = async (req, res) => {
  try {
    const newItem = new MarketplaceItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: "Failed to create item." });
  }
};

export const getItems = async (req, res) => {
  const { region, type } = req.query;
  const query = {};
  if (region) query.region = region;
  if (type) query.type = type;

  const items = await MarketplaceItem.find(query);
  res.json(items);
};
