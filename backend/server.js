import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config/db.js';  
import { setupAssociations } from './models/associations.js';  // Import association setup
import authRoutes from './routes/auth.js';  
import habitsRoutes from './routes/Habits.js';
import categoryRoutes from './routes/categoryRoutes.js';
import passwordRoutes from './routes/password.js';  
import interestRoutes from "./routes/interestRoute.js"
// Initialize the app
import contactRoutes from "./routes/contactFeedback.js";
import accountsettting from "./routes/accountSetting.js";

const app = express();

// Middleware setup
app.use(cors());  
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);  
app.use('/api/password', passwordRoutes);
app.use("/api/interests", interestRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/account-setting',accountsettting);

// Start the server
const PORT = 5000;

app.listen(PORT, async () => {
  try {
    // Test database connection
    await sequelize.authenticate();  
    console.log('Database connected successfully');

    // Setup associations and sync models
    setupAssociations();
    await sequelize.sync({ alter: true });  // Automatically update the database schema

    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
