import express from "express";
import { createItem, getItems } from "../controllers/marketplaceController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getItems);

export default router;
