const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/clips/favorites', (req, res) => {
  const favoriteClips = db.get('clips').filter({ favorite: true }).value();
  res.json(favoriteClips);
});

module.exports = router;
