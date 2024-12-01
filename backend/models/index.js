// models/index.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import initializeUserModel from './User.js';
import initializeGoalModel from './Goal.js';
import initializeHabitModel from './Habit.js';
import initializeCategoryModel from './Category.js';
import initializeHabitProgressModel from './HabitProgress.js';

// Initialize models
const User = initializeUserModel(sequelize, Sequelize);
const Goal = initializeGoalModel(sequelize, Sequelize);
const Habit = initializeHabitModel(sequelize, Sequelize);
const Category = initializeCategoryModel(sequelize, Sequelize);
const HabitProgress = initializeHabitProgressModel(sequelize, Sequelize);

// Create a database object
const db = {
    sequelize,
    Sequelize,
    User,
    Goal,
    Category,
    Habit,
    HabitProgress,
};

// Export models and db as named exports if needed
export { User, Goal, Habit, Category, HabitProgress };
export default db;
