// const express = require('express');
// const db = require('../db');

// const router = express.Router();

// router.get('/', (req, res) => {
//   const programs = db.get('programs').value();
//   res.json(programs );
// });

// module.exports = router;


const express = require('express');
const axios = require('axios');
const db = require('../db');

const router = express.Router();

const baseUrl = 'https://api.omny.fm/orgs/acc8cc57-ff7c-44c5-9bd6-ab0900fbdc43';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/programs`);
    const programs = response.data.Programs.map(({Id, Name, Description, ArtworkUrl, Author}) => ({Id, Name, Description, ArtworkUrl, Author }));;
    db.set('programs', programs).write();
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

module.exports = router;
