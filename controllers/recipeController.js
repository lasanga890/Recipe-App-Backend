import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const basUrl = process.env.API_URL;

export const getCategories = async (req, res) => {
  await axios
    .get(`${basUrl}/categories.php`)
    .then((resp) => {
      res.status(200).json(resp.data);
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: "Error",
        error: err,
      });
    });
};
