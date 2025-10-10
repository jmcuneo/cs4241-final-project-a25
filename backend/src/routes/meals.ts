import { Router } from "express";
import prisma from "../db";

const router = Router();

router.post("/", async (req, res) => {
  const { userId, date, items } = req.body;

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
      include: { items: { include: { food: true } } },
    });

    res.json(meal);
  } catch (error) {
    console.error("Error creating meal:", error);
    res.status(500).json({ error: "Failed to create meal" });
  }
});

router.get("/", async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: { items: { include: { food: true } } },
      orderBy: { date: "desc" },
    });
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
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

router.get("/by-date", async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    // Build the where clause
    const whereClause: any = {};

    if (userId) {
      whereClause.userId = parseInt(userId as string);
    }

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate as string);
      }
    }

    const meals = await prisma.meal.findMany({
      where: whereClause,
      include: { items: { include: { food: true } } },
      orderBy: { date: "desc" },
    });

    // Group meals by date
    const mealsByDate = meals.reduce((acc: any, meal) => {
      const dateKey = meal.date.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          meals: [],
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
        };
      }

      // Calculate nutritional totals for this meal
      let mealCalories = 0;
      let mealProtein = 0;
      let mealCarbs = 0;
      let mealFat = 0;

      meal.items.forEach((item) => {
        const quantity = item.quantity;
        mealCalories += item.food.calories * quantity;
        mealProtein += item.food.protein * quantity;
        mealCarbs += item.food.carbs * quantity;
        mealFat += item.food.fat * quantity;
      });

      // Add meal with calculated totals
      acc[dateKey].meals.push({
        ...meal,
        calculatedNutrition: {
          calories: mealCalories,
          protein: mealProtein,
          carbs: mealCarbs,
          fat: mealFat,
        },
      });

      // Update daily totals
      acc[dateKey].totalCalories += mealCalories;
      acc[dateKey].totalProtein += mealProtein;
      acc[dateKey].totalCarbs += mealCarbs;
      acc[dateKey].totalFat += mealFat;

      return acc;
    }, {});

    // Convert to array and sort by date
    const result = Object.values(mealsByDate).sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    res.json(result);
  } catch (error) {
    console.error("Error fetching meals by date:", error);
    res.status(500).json({ error: "Failed to fetch meals by date" });
  }
});

export default router;
