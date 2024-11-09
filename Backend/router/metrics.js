const express = require('express');
const router = express.Router();
const User = require('../Modals/User'); // Ensure this path is correct
// const Metrics = require('../Modals/Metrics'); // Assuming you have a Metrics model, adjust accordingly

// Example API endpoint to fetch user metrics
router.get('/user-metrics/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const metrics = {
        leetcode_rating: 1500,  // Default value
        repository_count: 10,    // Default value
        contests_attended: 7,   // Default value
      };
  
      // Check if leetcodeInfo exists and contains at least one item
      if (user.leetcodeInfo && user.leetcodeInfo.length > 0) {
        metrics.leetcode_rating = user.leetcodeInfo[0].userContestDetails.rating || 1500;
        metrics.contests_attended = user.leetcodeInfo[0].userContestDetails.attendedContestsCount || 0;
      }
  
      // Check if githubInfo exists and contains at least one item
      if (user.githubInfo && user.githubInfo.length > 0) {
        metrics.repository_count = user.githubInfo[0].repositories.length || 0;
      }

    return res.json({ data: metrics });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
