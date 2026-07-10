const express = require('express');
const { User, Subscription } = require('../models');
const auth = require('../middleware/auth'); // assuming there's an auth middleware

const router = express.Router();

// Get channel/user details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'isVerified', 'followerCount']
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the current user (if logged in via query or header) is subscribed
    // We will handle this in the frontend by passing the current user ID
    // or through an optional auth middleware if needed.
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if a user is subscribed to a channel
router.get('/:channelId/isSubscribed', auth, async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const followerId = req.user.id; // from auth middleware

    const sub = await Subscription.findOne({
      where: { followerId, channelId }
    });

    res.json({ isSubscribed: !!sub });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to a channel
router.post('/:channelId/subscribe', auth, async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const followerId = req.user.id;

    if (channelId === followerId) {
      return res.status(400).json({ error: 'Cannot subscribe to yourself' });
    }

    const channel = await User.findByPk(channelId);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    const [sub, created] = await Subscription.findOrCreate({
      where: { followerId, channelId }
    });

    if (created) {
      channel.followerCount += 1;
      await channel.save();
    }

    res.json({ success: true, isSubscribed: true, followerCount: channel.followerCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe from a channel
router.post('/:channelId/unsubscribe', auth, async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const followerId = req.user.id;

    const channel = await User.findByPk(channelId);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    const deletedCount = await Subscription.destroy({
      where: { followerId, channelId }
    });

    if (deletedCount > 0) {
      channel.followerCount = Math.max(0, channel.followerCount - 1);
      await channel.save();
    }

    res.json({ success: true, isSubscribed: false, followerCount: channel.followerCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
