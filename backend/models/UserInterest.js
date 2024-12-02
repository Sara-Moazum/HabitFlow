import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import {User} from "./User.js";
import Interest from "./Interest.js";

const UserInterest = sequelize.define("UserInterest", {
    Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "userId",
        },
        allowNull: false,
    },
    interestId: {
        type: DataTypes.INTEGER,
        references: {
            model: Interest,
            key: "interestId",
        },
        allowNull: false,
    },
  
}, 
{
    timestamps: false,
    tableName: 'user_interests',
}
);

// Associations
User.belongsToMany(Interest, { through: UserInterest });
Interest.belongsToMany(User, { through: UserInterest });

export default UserInterest;
