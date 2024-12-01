// Import necessary modules using ES module syntax
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import authRoutes from './routes/auth.js';
import habitsRoutes from './routes/Habits.js';
import categoryRoutes from './routes/categoryRoutes.js';
import passwordRoutes from './routes/password.js';
import interestRoutes from './routes/interestRoute.js'; // ES module import

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use('/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use("/api/interests", interestRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/categories', categoryRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
