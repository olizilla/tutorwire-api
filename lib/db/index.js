var config = require('../../config.js');
var cradle = require('cradle');

cradle.setup({
  host: config.db.host
});

var server = new(cradle.Connection)();

var db = server.database(config.db.name);

db.exists(function (err, exists) {
  if (err) {
    console.error('Error connecting to db:', err);
  } else if (exists) {
    console.log('Connected to:', db.name);
  } else {
    console.log('DB NOT FOUND. Creating:', db.name);
    db.create();
    /* populate design documents */
  }
});

module.exports = {
  db: db,
  server: server
};