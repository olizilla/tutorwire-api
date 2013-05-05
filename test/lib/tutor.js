var db = require('../../lib/db');
var tutorApi = require('../../lib/tutor');
var async = require('async');

module.exports = {
	
	setUp: function(cb) {
		
		function onDbOpen(err) {
			if(err) return console.error('Failed to open database', err);
			
			db.collection('tutors', function(err, tutors) {
				// Ensure the tutors collection is empty
				tutors.remove({}, cb);
			});
		}
		
		// If the DB is connected then perform setup straight away...
		if(db.serverConfig.isConnected()) {
			onDbOpen();
		// If the DB is connecting then perform the setup when open
		} else if(db._state == 'connecting') {
			db.once('open', onDbOpen);
		// If the DB is not open or opening then open and perform setup
		} else {
			db.open(onDbOpen);
		}
	},
	
	tearDown: function(cb) {
		
		// clean up
		db.close(function(err) {
			if(err) return console.error('Failed to open database', err);
			cb();
		});
	},
	
	'Test getOne validates PUID correctly': function(test) {
		
		// Data that should cause getOne to return an error
		var testData = [null, '', undefined, false, [], 0];
		
		// Array of tasks that submit the test data to getOne
		var tasks = testData.map(function(input) {
			return function(cb) {
				tutorApi.getOne(input, function(err, tutor) {
					cb(null, {err: err, tutor: tutor});
				});
			};
		});
		
		test.expect((testData.length * 2) + 1);
		
		// Perform the tasks and inspect the results
		async.parallel(tasks, function(err, results) {
			
			// Performing the tasks should not have caused an error
			test.ifError(err);
			
			// All results should be Errors
			results.forEach(function(result) {
				
				// Ensure no tutor was returned
				test.equal(result.tutor, undefined);
				
				// Ensure an error was returned
				test.ok(result.err);
			});
			
			test.done();
		});
	},
	
	'Test getNear returns results in expected order': function(test) {
		
		// Insert some data
		var data = [{
				"name": "David",
				"subjects": ["Music", "Drama", "Maths"],
				"location": {
					"name": "Peckham",
					"coords": {"lat": 51.473938, "lng": -0.06875}
				}
			}, {
				"name": "Charlie",
				"subjects": ["Maths", "Physics"],
				"location": {
					"name": "Croydon",
					"coords": {"lat": 51.374667, "lng": -0.097504}
				}
			}, {
				"name": "Inigo",
				"subjects": ["Sword Fighting"],
				"location": {
					"name": "Hoxton",
					"coords": {"lat": 51.530739, "lng": -0.076861}
				}
			}
		];
		
		var tasks = data.map(function(d) {
			return function(cb) {
				tutorApi.add(d, cb);
			};
		});
		
		test.expect(6);
		
		// Once the data is inserted, the testing can begin!
		async.parallel(tasks, function(err) {
			
			test.ifError(err);
			
			// Portsmouth
			var coord = {lat: 50.790195, lng: -1.07769};
			
			// Method under test
			tutorApi.getNear(coord, function(err, results) {
				
				test.ifError(err);
				
				test.equal(results.length, 3);
				
				// Results should be in the order Charlie, David, Inigo
				test.equal(results[0].name, 'Charlie');
				test.equal(results[1].name, 'David');
				test.equal(results[2].name, 'Inigo');
				
				test.done();
			});
		});
	}
};