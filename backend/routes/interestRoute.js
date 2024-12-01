import express from 'express';
import { User } from '../models/User.js'; // Ensure correct path
import UserInterest from '../models/UserInterest.js';
import Interest from '../models/Interest.js';

const router = express.Router();


// Handle POST requests for saving interests
router.post('/save', async (req, res) => {
  const { userId, selectedInterests } = req.body;
  console.log('Received userId:', userId);
  console.log('Received selectedInterests:', selectedInterests);

  if (!userId || !Array.isArray(selectedInterests) || selectedInterests.length === 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Look up interest IDs from names
    const interests = await Interest.findAll({
      where: {
        interestName: selectedInterests, // Match interestName to the provided names
      },
      attributes: ['interestId'], // Only fetch interestId
    });

    if (interests.length === 0) {
      return res.status(404).json({ message: 'No matching interests found' });
    }

    // Map interest IDs to user interests
    const userInterests = interests.map((interest) => ({
      userId,
      interestId: interest.interestId, // Use the interestId from the lookup
    }));

    // Bulk create user interests
    await UserInterest.bulkCreate(userInterests);

    res.status(201).json({ message: 'Interests saved successfully' });
  } catch (error) {
    console.error('Error saving interests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; // Use export default for ES module syntax
