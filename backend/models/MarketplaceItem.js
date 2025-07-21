import mongoose from "mongoose";

const marketplaceItemSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    region: String,
    type: {
        type: String,
        enum: ["sell", "buy", "exchange"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const MarketplaceItem = mongoose.model("MarketplaceItem", marketplaceItemSchema);
export default MarketplaceItem;