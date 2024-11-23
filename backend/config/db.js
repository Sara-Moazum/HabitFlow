import 'dotenv/config'
import { Sequelize} from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USERNAME,process.env.DATABASE_PASSWORD,{
    host: process.env.DATABASE_HOST,
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