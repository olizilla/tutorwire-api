// tutor/index.js
var db = module.require('../db');
var shortId = module.require('shortid');

db.save('_design/tutors', {
	all: {
		map: function (doc) {
			if (doc.name) emit(doc._id, doc);
		}
	},
	bySubject: {
		map: function (doc) {
			if (doc.subjects) {
				for(var i = 0; i < doc.subjects.length; ++i) {
					emit(doc.subjects[i], doc);
				}
			}
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
			
			var tutors = res.map(function(item){
				return {
					name: item.name
				};
			});

			cb(null, tutors);
		});
	},
	
	getBySubject: function(subject, cb) {
		db.view('tutors/bySubject', {key: subject}, function(err, res){
			if(err) return cb(err);
			
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

		db.save(id, data, function(err, res){
			console.log(res);
			cb(err, res);
		});
	},
	
	update: function(id, data, cb) {
		
		db.merge(id, data, function(err, res) {
			console.log(res);
			cb(err, res);
		});
	}
};


