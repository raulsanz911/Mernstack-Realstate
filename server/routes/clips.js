const express = require('express');
const axios = require('axios');
const db = require('../db');

const router = express.Router();

const baseUrl = 'https://api.omny.fm/orgs/acc8cc57-ff7c-44c5-9bd6-ab0900fbdc43';

router.get('/programs/:programId/clips', async (req, res) => {
  const programId = req.params.programId;
  const limit = req.query.limit || 50;

  const clips = db.get('clips').filter({ programId }).value();

  if (clips.length > 0) {
    res.json(clips);
  } else {
    try {
      const clipsResponse = await axios.get(`${baseUrl}/programs/${programId}/clips`);
      const clips = clipsResponse.data.Clips.slice(0, limit);
      clips.forEach(({Id, Title, Description, AudioUrl, ImageUrl, PublishedUtc, DurationSeconds}) => {
        db.get('clips').push({Id, Title, Description, AudioUrl, ImageUrl, PublishedUtc, DurationSeconds,  programId }).write();
      });
      res.json(clips);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch clips' });
    }
  }
});

module.exports = router;
