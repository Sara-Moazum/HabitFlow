import { Sequelize,DataTypes } from "sequelize";
import sequalize from "../config/db.js";

const User = sequalize.define('User',{
    userId: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    email: {
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    signUpDate: {
        type: DataTypes.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW,
    },
}, {
    timestamps: false,
    tableName: 'users'
});

export {User};