import { Router } from "express";
import prisma from "../db";

const router = Router();

router.get("/", async (req, res) => {
    try {
    const foods = await prisma.food.findMany();
    res.json(foods);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch foods"})
    }
});

export default router;

