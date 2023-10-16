const express = require('express');
const axios = require('axios');
const db = require('../db');

const router = express.Router();

router.post('/programs/:programId/clips/:clipId/favorite', (req, res) => {
    const clipId = req.params.clipId;
    // Update the clip in the database to mark it as favorite
    db.get('clips').find({ Id: clipId }).assign({ favorite: true }).write();
    res.json({ success: true });
  });

  module.exports = router;

  