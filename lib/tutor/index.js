// tutor/index.js
var db = module.require('../db');
var shortId = module.require('shortid');

db.save('_design/tutors', {
	all: {
		map: function (doc) {
			if (doc.name) emit(doc._id, doc);
		}
	}
});

module.exports = {

	getOne: function(id, cb){
		db.get(id, cb);
	},

	getAll: function(cb){
		db.view('tutors/all', function(err, res){
			if(err) return cb(err);
			console.log(res);
			var tutors = res.map(function(item){
				return {
					name: item.name
				};
			});

			cb(null, tutors);
		});
	},

	add: function(data, cb){
		// TODO: Validata data is a tutor

		var id = shortId.generate();

		db.save(id, data, function(err, resp){
			console.log(resp);
			cb(err, resp);
		});
	}
};


