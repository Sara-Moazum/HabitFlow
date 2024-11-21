import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { User } from './User.js';  
import { Habit } from './Habit.js'; 

const Goal = sequelize.define('Goal', {
    goalId: {
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
    habitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Habit, 
            key: 'habitId', 
        },
    },
    goal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    numberOfDaysToTrack: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'goals',
});

Goal.belongsTo(User, { foreignKey: 'userId' }); 
Goal.belongsTo(Habit, { foreignKey: 'habitId' }); 

export { Goal };
