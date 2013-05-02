// tutor/index.js
var data = module.require('../db');
var shortId = module.require('shortid');

module.exports = {

	getOne: function(req, res, next){
		var id = req.params.id;
		data.db.get(id, function(err, doc){
			res.send(doc);
			return next();	
		});
		
	},

	// TODO: implement..
	getAll: function(req, res, next){
		res.send('tutor ALL' + req.params.name);
		// data.db.getAll();
		return next();
	},

	putOne: function(req, res, next){
		var id = shortId.generate();
		// TODO: pull body from request and validate
		var body = { name: 'bob-' + id } ;
		data.db.save(id, body, function(err, response){
			console.log(response);
			res.send(response);
			return next();
		});
	}
};


