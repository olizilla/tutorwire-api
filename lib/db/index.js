var config = require('config');
var mongo = require('mongodb');

var server = new mongo.Server(config.db.host, config.db.port, config.db.opts);
var db = new mongo.Db(config.db.name, server);

db.open(function(err, db){
	if(err) console.error('Failed to open db', err);
	console.log('Opened database', config.db.name);
});

module.exports = db;