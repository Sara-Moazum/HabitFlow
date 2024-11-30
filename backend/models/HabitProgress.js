import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const HabitProgress = sequelize.define('HabitProgress', {
    progressId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    habitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

export { HabitProgress };
