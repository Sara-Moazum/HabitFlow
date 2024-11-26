import express from 'express';
import { Habit } from '../models/Habit.js';
import { HabitProgress } from '../models/HabitProgress.js';  // Import HabitProgress model
import { Goal } from '../models/Goal.js';  // Import Goal model

const router = express.Router();

// Get habits for a user by frequency
router.get('/:frequency', async (req, res) => {
  const { userId } = req.query;
  const { frequency } = req.params;

  try {
    const habits = await Habit.findAll({
      where: { userId, frequency },
      attributes: ['habitId', 'habitName', 'description', 'frequency'],
    });

    if (habits.length === 0) {
      return res.status(404).json({ message: 'No habits found for the selected frequency.' });
    }

    return res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return res.status(500).json({ message: 'Failed to fetch habits.' });
  }
});

// Save a new habit
router.post('/createhabit', async (req, res) => {
  const { userId, habitName, description, frequency, categoryId } = req.body;

  try {
    const newHabit = await Habit.create({
      userId,
      habitName,
      description,
      frequency,
      categoryId,
    });
    return res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return res.status(500).json({ message: 'Failed to create habit.' });
  }
});

// Update habit progress
router.post('/update-progress', async (req, res) => {
  const { userId, habitId, date, progress } = req.body;

  try {
    const existingProgress = await HabitProgress.findOne({
      where: { userId, habitId, completionDate: date },
    });

    if (existingProgress) {
      existingProgress.isCompleted = progress;  // true for completed, false for missed
      await existingProgress.save();
    } else {
      // Create a new record if no previous progress exists for this date
      await HabitProgress.create({
        userId,
        habitId,
        completionDate: date,
        isCompleted: progress,
      });
    }

    return res.status(200).json({ message: 'Progress updated successfully!' });
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
        where: { userId },
        required: false,  // Not all habits will have a goal
      }],
      attributes: ['habitId', 'habitName', 'description', 'frequency', 'startDate'],
    });

    if (habitsWithGoals.length === 0) {
      return res.status(404).json({ message: 'No habits found for this user.' });
    }

    return res.status(200).json(habitsWithGoals);
  } catch (error) {
    console.error('Error fetching habits with goals:', error);
    return res.status(500).json({ message: 'Failed to fetch habits with goals.' });
  }
});

// Delete completed habit from the user dashboard (optional)
router.post('/delete-completed-habits', async (req, res) => {
  const { userId } = req.body;

  try {
    // Delete habits where the user has marked them as completed
    await Habit.destroy({
      where: { userId, isCompleted: true },
    });

    return res.status(200).json({ message: 'Completed habits deleted successfully.' });
  } catch (error) {
    console.error('Error deleting completed habits:', error);
    return res.status(500).json({ message: 'Failed to delete completed habits.' });
  }
});

export default router;
