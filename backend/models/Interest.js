import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Interest = sequelize.define(
    "Interest",
    {
      interestId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // Explicitly set this as the primary key
      },
      interestName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
      tableName: "interests",
    }
  );
  
  export {Interest};
  


