import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "../models/db.js"; // Assuming you have a db.js file for database connection

const suppliersRouter = express.Router();

// fetch all suppliers
suppliersRouter.get("/", async (req, res) => {
  const query = `select * from supplier;`;
  try {
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching suppliers data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default suppliersRouter;