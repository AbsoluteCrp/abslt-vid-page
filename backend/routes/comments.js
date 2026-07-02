const express = require('express');
const { Comment, User } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get comments for a video
router.get('/video/:videoId', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { videoId: req.params.videoId },
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post a comment (Protected)
router.post('/video/:videoId', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required' });

    const comment = await Comment.create({
      text,
      videoId: req.params.videoId,
      userId: req.user.id
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
