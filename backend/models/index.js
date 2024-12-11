// models/index.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import initializeUserModel from './User.js';
import initializeGoalModel from './Goal.js';
import initializeHabitModel from './Habit.js';
import initializeCategoryModel from './Category.js';
import initializeHabitProgressModel from './HabitProgress.js';
import initializedefaulthabit from './DefaultHabit.js';

import initializeinteresthabit from './InterestHabit.js';
// Initialize models
const User = initializeUserModel(sequelize, Sequelize);
const Goal = initializeGoalModel(sequelize, Sequelize);
const Habit = initializeHabitModel(sequelize, Sequelize);
const Category = initializeCategoryModel(sequelize, Sequelize);
const HabitProgress = initializeHabitProgressModel(sequelize, Sequelize);
const DefaultHabit= initializedefaulthabit(sequelize,Sequelize);
const InterestHabit= initializeinteresthabit(sequelize,Sequelize);

// Create a database object
const db = {
    sequelize,
    Sequelize,
    User,
    Goal,
    Category,
    Habit,
    HabitProgress,
    InterestHabit,
    DefaultHabit,
};

// Export models and db as named exports if needed
export { User, Goal, Habit, Category, HabitProgress ,InterestHabit,DefaultHabit};
export default db;
