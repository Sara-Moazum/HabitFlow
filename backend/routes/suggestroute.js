import express from "express";
import {UserInterest} from "../models/UserInterest.js";
import {InterestHabit }from "../models/InterestHabit.js";

import { DefaultHabit } from "../models/DefaultHabit.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
  
        // Step 1: Get user's interests
        const userInterests = await UserInterest.findAll({
            where: { userId },
            include: ["Interest"], // Adjust if aliases are used
        });
  
        const interestIds = userInterests.map((ui) => ui.interestId);
  
        // Step 2: Fetch habits based on user's interests
        const interestHabits = await InterestHabit.findAll({
            where: { interestId: interestIds },
        });
  
        // Step 3: Fetch default habits for fixed categories (only Health & Fitness, Hobbies, and Productivity)
        const fixedCategories = ["Health & Fitness", "Hobbies", "Productivity"];
        const defaultHabits = await DefaultHabit.findAll({
            include: ["Category"], // Ensure Category association is defined
            where: {
                "$Category.categoryName$": fixedCategories,
            },
        });
  
        // Group habits by category
        const categoryHabitMap = {};
        fixedCategories.forEach((category) => {
            categoryHabitMap[category] = [];
        });
  
        // Add the default habits to the correct categories
        defaultHabits.forEach((habit) => {
            const categoryName = habit.Category.categoryName;
            if (categoryHabitMap[categoryName]) {
                categoryHabitMap[categoryName].push(habit);
            }
        });
  
        // Add interest habits under the "Other" category (if necessary)
        interestHabits.forEach((habit) => {
            const categoryName = "Other"; // Default category for interest-based habits
            if (!categoryHabitMap[categoryName]) {
                categoryHabitMap[categoryName] = [];
            }
            categoryHabitMap[categoryName].push(habit);
        });
  
        res.json({ categoryHabits: categoryHabitMap });
    } catch (error) {
        console.error("Error fetching habit suggestions:", error);
        res.status(500).json({ error: "Failed to fetch habit suggestions." });
    }
  });
  

export default router;