import express from 'express';
import { Habit } from '../models/Habit.js';
import { Goal } from '../models/Goal.js';

const router = express.Router();

// Get habits for a user by frequency
router.get('/:frequency', async (req, res) => {
  const { userId } = req.query;
  const { frequency } = req.params;

  try {
    const habits = await Habit.findAll({
      where: { userId },
      attributes: ['habitId', 'habitName', 'description', 'startDate'],
    });

    if (habits.length === 0) {
      return res.status(200).json({ message: 'No habits found for the selected frequency.' });
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

// Update habit progress (placeholder for now)
router.post('/update-progress', async (req, res) => {
  const { userId, habitId, date, progress } = req.body;

  try {
    // Logic for updating habit progress should go here (currently not implemented)
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
        required: false,
      }],
      attributes: ['habitId', 'habitName', 'description', 'frequency', 'startDate'],
    });

    if (habitsWithGoals.length === 0) {
      return res.status(200).json({ message: 'No habits found for this user.' });
    }

    return res.status(200).json(habitsWithGoals);
  } catch (error) {
    console.error('Error fetching habits with goals:', error);
    return res.status(500).json({ message: 'Failed to fetch habits with goals.' });
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
  const { habitName, description, frequency, categoryId,startDate } = req.body;

  try {
    const habit = await Habit.findByPk(habitId);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    habit.habitName = habitName || habit.habitName;
    habit.description = description || habit.description;
    habit.frequency = frequency || habit.frequency;
    habit.categoryId = categoryId || habit.categoryId;
    habit.startDate = startDate || habit.startDate;


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
  const { goal, progressTrack, startDate} = req.body;

  try {
    const newGoal = await Goal.create({
      userId,
      habitId,
      goal,
      startDate,
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

export default router;

// router.get('/all', async (req, res) => {
//   const { userId } = req.query;
//   try {
//     // Fetch all habits for the user
//     const habits = await Habit.findAll({
//       where: { userId },
//       attributes: ['habitId', 'habitName', 'description', 'frequency', 'startDate'],
//     });
//     console.log("✅🚀✅")

//     if (habits.length === 0) {
//       return res.status(200).json({ message: 'No habits found for this user.' });
//     }

//     // Fetch all goals for the user's habits
//     const habitIds = habits.map(habit => habit.habitId);
//     const goals = await Goal.findAll({
//       where: {
//         habitId: habitIds,
//         userId, 
//       },
//       attributes: ['goalId', 'habitId', 'startDate', 'numberOfDaysToTrack'],
//     });

//     console.log("🚀Goals==",goals)
//     // Map goals by habitId for quick lookup
//     const goalsMap = {};
//     goals.forEach(goal => {
//       goalsMap[goal.habitId] = goal;
//     });

//     // Merge goals with corresponding habits
//     const habitsWithGoals = habits.map(habit => ({
//       ...habit.toJSON(), // Convert Sequelize instance to plain object
//       goal: goalsMap[habit.habitId] || null, // Include goal if it exists
//     }));

//     console.log("🚀🚀🚀Habit with goals==",habitsWithGoals )
//     // Filter out habits with no associated goals if necessary
//     const filteredHabits = habitsWithGoals.filter(habit => habit.goal);

//     return res.status(200).json(filteredHabits);
//   } catch (error) {
//     console.error('Error fetching habits with goals:', error);
//     return res.status(500).json({ message: 'Failed to fetch habits with goals.' });
//   }
// });