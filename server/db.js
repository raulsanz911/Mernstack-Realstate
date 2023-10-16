const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const lodashId = require('lodash-id');

// Create a Lowdb database
const adapter = new FileSync('db.json');
const db = low(adapter);

// Add lodash-id methods and create a collection for programs and clips
db._.mixin(lodashId);
db.defaults({ programs: [], clips: [] }).write();

module.exports = db;
