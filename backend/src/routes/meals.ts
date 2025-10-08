import {Router} from "express";
import prisma from "../db";

const router = Router();

router.post("/", async (req, res) => {
    const {userId, date, items} = req.body;

    try {
        const meal = await prisma.meal.create({
            data: {
                userId,
                date: new Date(date),
                items: {
                    create: items.map((item: any) => ({
                        foodId: item.foodId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {items: {include: {food: true}}},
        });

        res.json(meal);
    } catch (error) {
        console.error("Error creating meal:", error);
        res.status(500).json({error: "Failed to create meal"});
    }
});

router.get("/", async (req, res) => {
    try {
        const meals = await prisma.meal.findMany({
            include: {items: {include: {food: true}}},
            orderBy: {date: "desc"},
        });
        res.json(meals);
    } catch (error) {
        console.error("Error fetching meals:", error);
        res.status(500).json({error: "Failed to fetch meals"});
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const meal = await prisma.meal.findUnique({
            where: { id: parseInt(id) },
            include: { items: { include: { food: true } } },
        });

        if (!meal) {
            return res.status(404).json({ error: "Meal not found" });
        }

        res.json(meal);
    } catch (error) {
        console.error("Error fetching meal:", error);
        res.status(500).json({ error: "Failed to fetch meal" });
    }
});


export default router;
