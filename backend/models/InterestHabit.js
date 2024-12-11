import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import {Interest} from "./Interest.js";
import { Category } from "./Category.js";

const InterestHabit = sequelize.define(
    "InterestHabit",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull:false,
        },
        interestId: {
            type: DataTypes.INTEGER,
            references: {
                model: Interest,
                key: "interestId",
            },
            allowNull: false,
        },
        habitName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        habitDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
         categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: Category,
                key: "categoryId",
            },
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "interest_habits",
    }
);

Interest.hasMany(InterestHabit, { foreignKey: "interestId" });
InterestHabit.belongsTo(Interest, { foreignKey: "interestId" });

Category.hasMany(InterestHabit, { foreignKey: "categoryId" });
InterestHabit.belongsTo(Category, { foreignKey: "categoryId" });

export {InterestHabit};