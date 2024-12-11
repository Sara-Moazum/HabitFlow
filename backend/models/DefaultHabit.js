import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { Category } from "./Category.js";

const DefaultHabit = sequelize.define(
    'DefaultHabit',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull:false,
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
        tableName: "default_habits",
    }
);

Category.hasMany(DefaultHabit, { foreignKey: "categoryId" });
DefaultHabit.belongsTo(Category, { foreignKey: "categoryId" });

export { DefaultHabit};