import express from 'express';
import { User } from '../models/User.js'; // Adjust to your database setup
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:userId', async (req, res) => {
    const { firstname, lastname, username, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optional: Verify old password if needed
        if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Update user fields
        user.firstname = firstname;
        user.lastname = lastname;
        user.username = username;

        // Hash and update password if provided
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash password with salt rounds
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: 'Account settings updated successfully' });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
