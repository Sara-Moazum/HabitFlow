import { Habit } from './Habit.js';
import { HabitProgress } from './HabitProgress.js';
import { User } from './User.js';
import { Category } from './Category.js';
import { Goal } from './Goal.js';

export const setupAssociations = () => {
  // User-Habit Association
  User.hasMany(Habit, { foreignKey: 'userId' });
  Habit.belongsTo(User, { foreignKey: 'userId' });

  // Habit-Category Association
  Category.hasMany(Habit, { foreignKey: 'categoryId' });
  Habit.belongsTo(Category, { foreignKey: 'categoryId' });

  // Habit-HabitProgress Association
  Habit.hasMany(HabitProgress, { foreignKey: 'habitId' });
  HabitProgress.belongsTo(Habit, { foreignKey: 'habitId' });

  // User-HabitProgress Association (if necessary)
  User.hasMany(HabitProgress, { foreignKey: 'userId' });
  HabitProgress.belongsTo(User, { foreignKey: 'userId' });

  // Habit-Goal Association
  Habit.hasOne(Goal, { foreignKey: 'habitId' });
  Goal.belongsTo(Habit, { foreignKey: 'habitId' });

  // User-Goal Association
  User.hasMany(Goal, { foreignKey: 'userId' });
  Goal.belongsTo(User, { foreignKey: 'userId' });
};
