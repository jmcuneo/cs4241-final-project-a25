import { Router } from "express";
import prisma from "../db";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const foods = await prisma.food.findMany();
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch foods" });
  }
});

router.get("/search", async (req, res) => {
  const { q: query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${query}&pageSize=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`USDA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching from USDA API:", error);
    res.status(500).json({ error: "Failed to fetch foods from USDA API" });
  }
});

export default router;
