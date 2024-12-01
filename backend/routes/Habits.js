import express from 'express';
import { Habit } from '../models/Habit.js';
import { HabitProgress } from '../models/HabitProgress.js';
import { Goal } from '../models/Goal.js';
import { Sequelize } from 'sequelize';  // <-- Import Sequelize here

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
      ],
    });    
    

    console.log('Habits with progress:', habits);

    // Return the habits with their latest progress
    return res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return res.status(500).json({ message: 'Failed to fetch habits.' });
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
          [Sequelize.Op.gte]: formattedDate + 'T00:00:00Z', // Ensure we're looking at the start of the day
          [Sequelize.Op.lte]: formattedDate + 'T23:59:59Z'  // Ensure we're looking at the end of the day
        }
      }
    });

    if (existingProgress) {
      // If the record exists, just toggle the isCompleted flag
      existingProgress.isCompleted = progress;
      await existingProgress.save(); // Save the updated record
      return res.status(200).json({ message: 'Progress updated successfully!' });
    } else {
      // If no record exists for this date, create a new progress record
      await HabitProgress.create({
        userId,
        habitId,
        completionDate: formattedDate, // Save the date in the correct format
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

// Delete completed habits for a user (optional)
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

export default router;
