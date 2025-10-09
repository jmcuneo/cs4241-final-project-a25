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
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${query}&pageSize=10&dataType=Foundation`,
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

router.get("/:fdcId", async (req, res) => {
  const { fdcId } = req.params;

  if (!fdcId || isNaN(Number(fdcId))) {
    return res.status(400).json({ error: "Valid fdcId parameter is required" });
  }

  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${process.env.USDA_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: "Food not found" });
      }
      throw new Error(`USDA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching food details from USDA API:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch food details from USDA API" });
  }
});

export default router;
