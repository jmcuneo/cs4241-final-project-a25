import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const foods = [
    { name: "Chicken Breast", calories: 47, protein: 31, carbs: 0, fat: 1 },
  ];

  await prisma.food.createMany({
    data: foods,
    skipDuplicates: true,
  });

  console.log("Seeded foods");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
