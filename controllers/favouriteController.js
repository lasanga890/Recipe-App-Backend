import axios from "axios";
import Favorite from "../models/favouriteModel.js";

const baseUrl = process.env.API_URL;

export const getFavorite = async (req, res) => {
  const { _id } = req.user;

  try {
    const favorites = await Favorite.find({ userId: _id });
    if (!favorites || favorites.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No favorites found" });
    }

    const favRecipe = await Promise.all(
      favorites.map(async (fav) => {
        const meal = await axios.get(`${baseUrl}/lookup.php?i=${fav.recipeId}`);
        return meal.data.meals ? meal.data.meals : null;
      })
    );

    const validFavRecipe = favRecipe.filter((fav) => fav !== null);

    if (validFavRecipe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No valid favorites found" });
    }

    res.status(200).json({
      success: true,
      message: "Fetched favorites successfully",
      data: validFavRecipe,
    });
  } catch (error) {
    console.error("Error getting favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error getting favorite!",
      error: error.message,
    });
  }
};

export const addFavorites = async (req, res) => {
  const { recipeId } = req.body;
  const { _id } = req.user;

  try {
    const existingFav = await Favorite.findOne({
      userId: _id,
      recipeId: recipeId,
    });
    if (existingFav) {
      return res
        .status(400)
        .json({ success: false, message: "Meal is already in your favorites" });
    }

    const newFavorite = new Favorite({ userId: _id, recipeId: recipeId });
    await newFavorite.save();
    res.status(201).json({
      success: true,
      message: "Meal added to favorites",
      data: newFavorite,
    });
  } catch (error) {
    console.error("Error adding to favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to favorite!",
      error: error.message,
    });
  }
};

export const removeFavorites = async (req, res) => {
  const { recipeId } = req.body;
  const { _id } = req.user;

  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: _id,
      recipeId: recipeId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
      data: favorite,
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error removing favorite!",
      error: error.message,
    });
  }
};
