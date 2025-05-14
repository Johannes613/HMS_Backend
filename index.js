// repo: https://github.com/Johannes613/HMS_Backend.git
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 3000;
import cors from "cors";
import router from "./routes/fourSix.js";
app.use(cors()); // Enable CORS for all routes

app.use(express.json());

app.use("/four-six", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
