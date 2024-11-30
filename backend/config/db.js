import { Sequelize} from "sequelize";

const sequelize = new Sequelize('HabitFlow','mahin','123456',{
    host: 'localhost',
    dialect: 'mysql',
});

const testDatabaseConnection = async() => {
    try{
        await sequelize.authenticate();
        console.log("Database connection established successfully.");
    } catch(error){
        console.error('Unable to connect to the database:',error);
    }
};

testDatabaseConnection();

export default sequelize;