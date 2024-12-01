import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const ContactFeedback = sequelize.define('ContactFeedback', {
  feedbackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  thoughts: {
    type: DataTypes.TEXT,
    allowNull: true, // Since this field isn't marked as NOT NULL in the SQL schema
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'submittedAt', // Ensures Sequelize maps this field correctly
  },
}, {
  tableName: 'contact_feedback', // Explicitly specify table name
  timestamps: false, // Disable default timestamps (createdAt and updatedAt)
});

export {ContactFeedback};
