import express from "express";
import {
  addFavorites,
  getFavorite,
  removeFavorites,
} from "../controllers/favouriteController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ensure `authenticateUser` is used on routes that require authentication
router.get("/get", authenticateUser, getFavorite); // Added authenticateUser here
router.post("/add", authenticateUser, addFavorites); // Added authenticateUser here
router.post("/remove", authenticateUser, removeFavorites); // Added authenticateUser here

export default router;
