import express from 'express';
import { Habit } from '../models/Habit.js';
import { HabitProgress } from '../models/HabitProgress.js';
import { Goal } from '../models/Goal.js';
import { Sequelize } from 'sequelize';  // <-- Import Sequelize here
import {UserInterest} from "../models/UserInterest.js";
import {InterestHabit }from "../models/InterestHabit.js";
import { DefaultHabit } from "../models/DefaultHabit.js";

const router = express.Router();
router.get('/:frequency', async (req, res) => {
  const { userId } = req.query;
  const { frequency } = req.params;

  try {
    // Fetch all habits based on the given frequency and userId
    const habits = await Habit.findAll({
      where: {
        userId,
        frequency,
      },
      attributes: ['habitId', 'habitName', 'description', 'frequency', 'nextDueDate'],
      include: [
        {
          model: HabitProgress,
          where: { userId }, // Ensure progress belongs to the same user
          attributes: ['progressId', 'isCompleted', 'completionDate'],
          required: false, // Include habits even if no progress exists
        },
        {
          model: Goal, // Include Goal model
          where: { userId }, // Ensure goal belongs to the same user
          attributes: ['goalId', 'goal'], // Adjust 'goal' to match the actual field in your Goal model
          required: false, // Include habits even if no goal exists
        }
      ],
    });

    res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits and goals:', error);
    res.status(500).json({ message: 'Error fetching habits and goals' });
  }
});






// Create a new habit
router.post('/createhabit', async (req, res) => {
    console.log("Request received at /createhabit:", req.body);  // Log the incoming request

    const { userId, habitName, description, frequency, categoryId } = req.body;

    try {
        // Set startDate to the current date (today)
        const startDateObj = new Date();  // Current date

        // Calculate nextDueDate based on frequency
        let nextDueDate;
        if (frequency === 'daily') {
            nextDueDate = new Date(startDateObj);
            nextDueDate.setDate(startDateObj.getDate() + 1);  // For daily habits, nextDueDate is one day after startDate
        } else if (frequency === 'weekly') {
            nextDueDate = new Date(startDateObj);
            nextDueDate.setDate(startDateObj.getDate() + 7);  // For weekly habits, nextDueDate is one week after startDate
        } else if (frequency === 'monthly') {
            nextDueDate = new Date(startDateObj);
            nextDueDate.setMonth(startDateObj.getMonth() + 1);  // For monthly habits, nextDueDate is one month after startDate
        }

        // Ensure nextDueDate is a valid date
        if (isNaN(nextDueDate)) {
            return res.status(400).json({ message: "Calculated nextDueDate is invalid." });
        }

        console.log('Calculated nextDueDate:', nextDueDate);

        // Create the habit with the calculated nextDueDate
        const newHabit = await Habit.create({
            userId,
            habitName,
            description,
            frequency,
            categoryId,
            startDate: startDateObj,  // Set the current date as startDate
            nextDueDate: nextDueDate,  // Set the nextDueDate based on frequency
        });

        const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

        // Create progress for today if it's not already created (but the event system should already handle this)
        const existingProgress = await HabitProgress.findOne({
            where: {
                userId,
                habitId: newHabit.habitId,
                completionDate: today,
            },
        });

        if (!existingProgress) {
            await HabitProgress.create({
                userId,
                habitId: newHabit.habitId,
                completionDate: today,
                isCompleted: false,
            });
        }

        console.log('Habit created:', newHabit);  // Log created habit
        return res.status(201).json(newHabit);
    } catch (error) {
        console.error('Error creating habit:', error);
        return res.status(500).json({ message: 'Failed to create habit.', error: error.message });
    }
});

router.post('/update-progress', async (req, res) => {
  const { userId, habitId, date, progress } = req.body;
  console.log('Data received:', req.body);

  try {
    // Ensure the date is in the correct format (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    // Use Sequelize to find progress for the same date, ignoring time
    const existingProgress = await HabitProgress.findOne({
      where: {
        userId,
        habitId,
        completionDate: {
          [Sequelize.Op.gte]: formattedDate + 'T00:00:00Z', 
          [Sequelize.Op.lte]: formattedDate + 'T23:59:59Z' 
        }
      }
    });

    if (existingProgress) {
      existingProgress.isCompleted = progress;
      await existingProgress.save(); 
      return res.status(200).json({ message: 'Progress updated successfully!' });
    } else {
      
      await HabitProgress.create({
        userId,
        habitId,
        completionDate: formattedDate, 
        isCompleted: progress,
      });
      return res.status(201).json({ message: 'New progress record created!' });
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ message: 'Failed to update progress.' });
  }
});

// Get all habits for a user, along with their associated goal
// Get all habits for a user, along with their associated goal
router.get('/all', async (req, res) => {
  const { userId } = req.query;

  try {
      const habitsWithGoals = await Habit.findAll({
          where: { userId },
          include: [{
              model: Goal,
              required: false, // Not all habits will have a goal
          }],
          attributes: ['habitId', 'habitName', 'description', 'frequency', 'startDate'],
      });

      // Return an array even if no habits exist
      return res.status(200).json(habitsWithGoals || []);
  } catch (error) {
      console.error('Error fetching habits with goals:', error);
      return res.status(500).json({ message: 'Failed to fetch habits with goals.' });
  }
});



router.post('/delete-completed-habits', async (req, res) => {
    const { userId } = req.body;

    try {
        await Habit.destroy({
            where: { userId },
        });

        return res.status(200).json({ message: 'Completed habits deleted successfully.' });
    } catch (error) {
        console.error('Error deleting completed habits:', error);
        return res.status(500).json({ message: 'Failed to delete completed habits.' });
    }
});

router.get('/getAllHabits/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const habits = await Habit.findAll({
      where: { userId },
      attributes: ['habitId', 'habitName', 'description', 'frequency', 'categoryId', 'startDate'],
    });

    if (habits.length === 0) {
      return res.status(404).json({ message: 'No habits found for this user.' });
    }

    return res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return res.status(500).json({ message: 'Failed to fetch habits.' });
  }
});

// Get details of a specific habit
router.get('/habitDetails/:habitId', async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await Habit.findOne({
      where: { habitId },
      attributes: ['habitId', 'habitName', 'description', 'frequency', 'categoryId', 'startDate'],
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    return res.status(200).json(habit);
  } catch (error) {
    console.error('Error fetching habit details:', error);
    return res.status(500).json({ message: 'Failed to fetch habit details.' });
  }
});


// Update a habit
router.put('/updatehabit/:habitId', async (req, res) => {
  const { habitId } = req.params;
  const { habitName, description, frequency, categoryId } = req.body;

  try {
    const habit = await Habit.findByPk(habitId);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    habit.habitName = habitName || habit.habitName;
    habit.description = description || habit.description;
    habit.frequency = frequency || habit.frequency;
    habit.categoryId = categoryId || habit.categoryId;
   


    await habit.save();

    return res.status(200).json({ message: 'Habit updated successfully.', habit });
  } catch (error) {
    console.error('Error updating habit:', error);
    return res.status(500).json({ message: 'Failed to update habit.' });
  }
});

// Delete a habit
router.delete('/deletehabit/:habitId', async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await Habit.findByPk(habitId);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    await Goal.destroy({
      where: {
        habitId: habitId
      }
    });

    await habit.destroy();

    return res.status(200).json({ message: 'Habit deleted successfully.' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return res.status(500).json({ message: 'Failed to delete habit.' });
  }
});


router.post('/setGoal/:habitId/:userId', async (req, res) => {
  const {habitId, userId}  = req.params
  console.log("habiId==",habitId)
  const { goal, progressTrack} = req.body;
  const startDateObj = new Date(); 

  try {
    const newGoal = await Goal.create({
      userId,
      habitId,
      goal,
      startDate:startDateObj,
      numberOfDaysToTrack: progressTrack
    });
    return res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return res.status(500).json({ message: 'Failed to create goal.' });
  }
});

router.get('/getGoal', async (req, res) => {

  try {
    // Fetch the goal associated with the given habitId
    const goal = await Goal.findAll();

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found for the given habitId' });
    }

    return res.status(200).json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    return res.status(500).json({ message: 'Failed to fetch goal.' });
  }
});

/*router.get("/suggesthabit/:userId", async (req, res) => {
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

      // Step 3: Fetch default habits for fixed categories
      const fixedCategories = ["Hobbies", "Health & Fitness", "Productivity"];
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

      defaultHabits.forEach((habit) => {
          const categoryName = habit.Category.categoryName;
          if (categoryHabitMap[categoryName].length < 3) {
              categoryHabitMap[categoryName].push(habit);
          }
      });

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
*/



export default router;

