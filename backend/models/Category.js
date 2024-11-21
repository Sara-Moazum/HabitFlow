import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
    tableName: 'categories',
});

export { Category };
