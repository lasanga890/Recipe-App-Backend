import express from "express";
import morgan from "morgan";
import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
ConnectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URI || "http://localhost:3000",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/user", authRoute);
// Port configuration
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
