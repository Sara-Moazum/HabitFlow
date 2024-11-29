import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

const router = express.Router();

// Utility function to validate password strength
const validatePasswordStrength = (password) => {
  return password.length >= 6; // Password must be at least 6 characters
};

router.post('/forgot-password', async (req, res) => {
  const { username } = req.body; // Capture username from the request body.

  try {
    // Check if the username exists in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      // If the username does not exist, return an error response
      return res.status(404).json({ message: 'Username not found' });
    }

    // If username exists, respond with a success message
    return res.status(200).json({ message: 'Username found. You can reset your password.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing your request' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body; // Capture username and new password from the request body.

  try {
    // Check if the username exists in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      // If the username does not exist, return an error response
      return res.status(404).json({ message: 'Username not found' });
    }

    // Validate the new password (e.g., length >= 6)
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});

export default router;
