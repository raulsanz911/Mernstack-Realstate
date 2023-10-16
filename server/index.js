const express = require('express');
const cors = require('cors');
const programRoutes = require('./routes/programs');
const clipRoutes = require('./routes/clips');
const markFarvoriteRoutes = require('./routes/markFavourite');
const farvoriteClipsRoutes = require('./routes/favoriteClips');

const fetchData = require('./fetchData');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Add CORS middleware
app.use(express.json()); // Add body-parser middleware

// Use program routes
app.use('/api/programs', programRoutes);

// Use clip routes
app.use('/api', clipRoutes);

// mark clip favourite
app.use('/api', markFarvoriteRoutes);

// get favourite clips
app.use('/api', farvoriteClipsRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Fetch data when the server starts up
// fetchData().then(() => {
//   // Start the server
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }).catch((error) => {
//   console.error(`Error fetching data: ${error.message}`);
// });
