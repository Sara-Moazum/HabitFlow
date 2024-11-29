import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { User } from './User.js';
import { Category } from './Category.js';

const Habit = sequelize.define('Habit', {
    habitId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'userId',
        },
    },
    habitName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    frequency: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'categoryId',
        },
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    nextDueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'habits',
});

export { Habit };
