import mongoose from "mongoose";

const favoriteSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  recipeId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Favorite", favoriteSchema);
