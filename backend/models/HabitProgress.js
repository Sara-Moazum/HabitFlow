import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { Habit } from './Habit.js'; // Import Habit model

const HabitProgress = sequelize.define('HabitProgress', {
    progressId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    habitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Habit,
            key: 'habitId',
        },
    },
    completionDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false,
    tableName: 'habit_progress',
});

// Establish association with Habit model
HabitProgress.belongsTo(Habit, { foreignKey: 'habitId' });

export { HabitProgress };
