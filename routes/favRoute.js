import express from "express";
import {
  addFavorites,
  getFavorite,
  removeFavorites,
} from "../controllers/favouriteController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get", authenticateUser, getFavorite);
router.post("/add", authenticateUser, addFavorites);
router.post("/remove", authenticateUser, removeFavorites);

export default router;
