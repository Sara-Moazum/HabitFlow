const express = require('express');
const router = express.Router();
const { User, Interest, UserInterest } = require('../models'); // Ensure correct path

// Handle POST requests for saving interests
router.post('/api/interests/save', async (req, res) => {
  const { userId, selectedInterests } = req.body;
  console.log('Received userId:', userId);
  console.log('Received selectedInterests:', selectedInterests);

  if (!userId || !Array.isArray(selectedInterests) || selectedInterests.length === 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validInterests = await Interest.findAll({
      where: {
        id: selectedInterests,
      },
    });

    if (validInterests.length !== selectedInterests.length) {
      return res.status(400).json({ message: 'Some interests are invalid' });
    }

    const userInterests = selectedInterests.map((interestId) => ({
      userId,
      interestId,
    }));

    await UserInterest.bulkCreate(userInterests);

    res.status(201).json({ message: 'Interests saved successfully' });
  } catch (error) {
    console.error('Error saving interests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
