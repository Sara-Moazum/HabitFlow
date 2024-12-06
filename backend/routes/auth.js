import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; 

const router = express.Router();

// Utility function to validate email format
const validateEmailFormat = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// Utility function to validate password strength
const validatePasswordStrength = (password) => {
  return password.length >= 6; // Password must be at least 6 characters
};

// Signup route
router.post('/signup', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Ensure required fields are not missing
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create new user with default hasSelectedInterests as false
    const newUser = await User.create({
      firstname: firstName,
      lastname: lastName,
      username: username,
      email: email,
      password: hashedPassword,
      hasSelectedInterests: false, // Default value for first-time users
    });

    return res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred during signup' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Update lastLogin timestamp
    await user.update({ lastLogin: new Date() });

    // Create a JWT token including userId, username, and hasSelectedInterests
    const token = jwt.sign(
      { userId: user.userId, username: user.username, hasSelectedInterests: user.hasSelectedInterests },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      message: "Login successful", 
      token, 
      hasSelectedInterests: user.hasSelectedInterests 
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Error during login", error: error.message });
  }
});

export default router;
