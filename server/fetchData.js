const axios = require('axios');
const db = require('./db');

const baseUrl = 'https://api.omny.fm/orgs/acc8cc57-ff7c-44c5-9bd6-ab0900fbdc43';

async function fetchData() {
    const response = await axios.get(`${baseUrl}/programs`);
    const programs = response.data.Programs.map(({Id, Name, Description, ArtworkUrl, Author}) => ({Id, Name, Description, ArtworkUrl, Author }));;
    db.set('programs', programs).write();
}

module.exports = fetchData;
