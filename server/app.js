const express = require('express');
const axios = require('axios');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Add CORS middleware

// Create a Lowdb database
const adapter = new FileSync('db.json');
const db = low(adapter);

// Add lodash-id methods and create a collection for programs
db._.mixin(lodashId);
db.defaults({ programs: [], clips: [] }).write();

const baseUrl = 'https://api.omny.fm/orgs/acc8cc57-ff7c-44c5-9bd6-ab0900fbdc43';

// Fetch data from the API and store it in the Lowdb database
async function fetchData() {
    const response = await axios.get(`${baseUrl}/programs`);
    // const programs = response.data.Programs;
    const programs = response.data.Programs.map(({Id, Name, Description, ArtworkUrl, Author}) => ({ Name, Description, Id, ArtworkUrl, ArtworkUrl, Author }));;
    db.set('programs', programs).write();
}

fetchData();


// Endpoint to get all programs
app.get('/api/programs', (req, res) => {
    const programs = db.get('programs').value();
    res.json({ programs });
});

// Endpoint to get the most recent clips for a program
app.get('/api/programs/:programId/clips', async (req, res) => {
    const programId = req.params.programId;
    const limit = req.query.limit || 50;
    // Check if the clips are already stored in the database
    const clips = db.get('clips').filter({ programId }).value();

    if (clips.length > 0) {
      // const recentClips = clips.slice(0, limit);
     res.json(clips);
    } else {
      // Fetch the clips from Omny API
      const clipsResponse = await axios.get(`${baseUrl}/programs/${programId}/clips`);
      const clips = clipsResponse.data.Clips.slice(0, limit);
      clips.forEach(({Title, Description, AudioUrl, ImageUrl, PublishedUtc}) => {
        db.get('clips').push({Title, Description, AudioUrl, ImageUrl, PublishedUtc,  programId }).write();
      });
        res.json(clips);
    }
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
