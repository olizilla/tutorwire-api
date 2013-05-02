// tutor/index.js
var db = module.require('../db');
var shortId = module.require('shortid');

db.on('open', function(){
	db.collection('tutors', function(err, tutors){
		if(err) return console.error('Failed to create Tutors collection', err);

		db.ensureIndex('tutors', {'location.coords': '2d'}, function(err, indexName) {
			if(err) return console.error('Failed to create location.coords 2d index', err);
			console.log('Ensured index', indexName);
		});
	});
});

module.exports = {

	getOne: function(puid, cb){

		db.collection('tutors', function(err, tutors){
			if(err) return cb(err);

			tutors.findOne({puid: puid}, cb);
		});
	},

	getAll: function(cb){
		db.collection('tutors', function(err, tutors){
			if(err) return cb(err);

			tutors.find({}).toArray(cb);
		});
	},
	
	getBySubject: function(subject, cb) {
		db.collection('tutors', function(err, tutors){
			if(err) return cb(err);

			// TODO: Optimise - "$regex can only use an index efficiently when the 
			// regular expression has an anchor for the beginning (i.e. ^) of a string
			// and is a case-sensitive match."
			// @see http://docs.mongodb.org/manual/reference/operator/regex/#op._S_regex
			tutors.find({ subjects: { $elemMatch: { $regex: subject, $options: 'i' } }}).toArray(cb);
		});
	},

	/**
	 * Get tutors near a lat, lng
	 *
	 * @param {Object} coord
	 * @param {Object} coord.lng Longitude
	 * @param {Object} coord.lat Latitude
	 * @param {Function} cb Callback function
	 */
	getNear: function(coord, cb) {
		db.collection('tutors', function(err, tutors){
			if(err) return cb(err);

			tutors.find({ 'location.coords': { $near: [coord.lng, coord.lat] }}).toArray(cb);
		});
	},

	add: function(data, cb){
		// TODO: Validata data is a tutor

		var puid = shortId.generate();
		data.puid = puid;

		db.collection('tutors', function(err, tutors){
			if(err) return cb(err);

			tutors.insert(data, cb);
		});
	},
	
	update: function(puid, data, cb) {
		
		db.collection('tutors', function(err, tutors){
			if(err) return cb(err);

			tutors.update({puid: puid}, {$set: data}, cb);
		});
	}
};
