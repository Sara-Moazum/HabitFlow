import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './config/db.js';  
import authRoutes from './routes/auth.js';  
import habitsRoutes from './routes/Habits.js';
import categoryRoutes from './routes/categoryRoutes.js';
import passwordRoutes from './routes/password.js';  // Import password reset routes

const app = express();

app.use(cors());  
app.use(express.json());




app.use('/auth', authRoutes);  
app.use('/api/password', passwordRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = 5000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();  // Check if the DB connection is working
    console.log('Database connected successfully');
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
