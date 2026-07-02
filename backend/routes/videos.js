const express = require('express');
const { Video, User } = require('../models');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'username'] }]
    });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    
    // Increment views
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload video (Protected)
router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No video file provided' });
    
    const video = await Video.create({
      title,
      description,
      filename: req.file.filename,
      userId: req.user.id
    });
    
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
