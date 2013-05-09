var db = require('../../lib/db');
var tutorApi = require('../../lib/tutor');
var async = require('async');
var assert = require('assert');

describe('Tutor', function() {
	
	beforeEach(function(done) {
		
		function onDbOpen(err) {
			if(err) return console.error('Failed to open database', err);
			
			db.collection('tutors', function(err, tutors) {
				// Ensure the tutors collection is empty
				tutors.remove({}, done);
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
	});
	
	afterEach(function(done) {
		
		// clean up
		db.close(function(err) {
			if(err) return console.error('Failed to open database', err);
			done();
		});
	});
	
	describe('#getOne', function() {
		
		it('should validate PUID correctly', function(done) {
			
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
			
			// Perform the tasks and inspect the results
			async.parallel(tasks, function(err, results) {
				
				// Performing the tasks should not have caused an error
				assert.ifError(err);
				
				// All results should be Errors
				results.forEach(function(result) {
					
					// Ensure no tutor was returned
					assert.equal(result.tutor, undefined);
					
					// Ensure an error was returned
					assert.ok(result.err);
				});
				
				done();
			});
		});
	});
	
	describe('#add', function() {
		
		it('should return created tutor', function(done) {
			
			var data = {
				"name": "David",
				"email": "david@example.org",
				"subjects": ["Music", "Drama", "Maths"],
				"location": {
					"name": "Peckham",
					"coords": {"lat": 51.473938, "lng": -0.06875}
				}
			};
			
			tutorApi.add(data, function(err, tutor) {
				assert.ifError(err);
				
				// API should not expose internal IDs
				assert.ifError(tutor._id);
				
				assert.equal(tutor.name, data.name);
				assert.equal(tutor.location.name, data.location.name);
				
				data.subjects.forEach(function(subject) {
					assert.ok(tutor.subjects.indexOf(subject) != -1);
				});
				
				assert.equal(tutor.location.coords.lat, data.location.coords.lat);
				assert.equal(tutor.location.coords.lng, data.location.coords.lng);
				
				done();
			});
		});
	});
	
	describe('#update', function() {
		
		it('should return updated tutor', function(done) {
			
			var data = {
				"name": "David",
				"email": "david@example.org",
				"subjects": ["Music", "Drama", "Maths"],
				"location": {
					"name": "Peckham",
					"coords": {"lat": 51.473938, "lng": -0.06875}
				}
			};
			
			tutorApi.add(data, function(err, tutor) {
				
				assert.ifError(err);
				
				tutorApi.update(tutor.puid, {name: 'Dave'}, function(err, tutor) {
					assert.ifError(err);
					
					// API should not expose internal IDs
					assert.ifError(tutor._id);
					
					assert.equal(tutor.name, 'Dave');
					assert.equal(tutor.location.name, data.location.name);
					
					data.subjects.forEach(function(subject) {
						assert.ok(tutor.subjects.indexOf(subject) != -1);
					});
					
					assert.equal(tutor.location.coords.lat, data.location.coords.lat);
					assert.equal(tutor.location.coords.lng, data.location.coords.lng);
					
					done();
				});
			});
		});
	});
	
	describe('#getNear', function() {
		
		it('should return results in expected order', function(done) {
			
			// Insert some data
			var data = [{
					"name": "David",
					"email": "david@example.org",
					"subjects": ["Music", "Drama", "Maths"],
					"location": {
						"name": "Peckham",
						"coords": {"lat": 51.473938, "lng": -0.06875}
					}
				}, {
					"name": "Charlie",
					"email": "charlie@example.org",
					"subjects": ["Maths", "Physics"],
					"location": {
						"name": "Croydon",
						"coords": {"lat": 51.374667, "lng": -0.097504}
					}
				}, {
					"name": "Inigo",
					"email": "inigo@example.org",
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
			
			// Once the data is inserted, the testing can begin!
			async.parallel(tasks, function(err) {
				
				assert.ifError(err);
				
				// Portsmouth
				var coord = {lat: 50.790195, lng: -1.07769};
				
				// Method under test
				tutorApi.getNear(coord, function(err, results) {
					
					assert.ifError(err);
					
					assert.equal(results.length, 3);
					
					// Results should be in the order Charlie, David, Inigo
					assert.equal(results[0].name, 'Charlie');
					assert.equal(results[1].name, 'David');
					assert.equal(results[2].name, 'Inigo');
					
					done();
				});
			});
		});
	});
	
	describe('#getSubjects', function() {
		
		it('should return distinct subject names', function(done) {
			
			// Insert some data
			var data = [{
					"name": "David",
					"email": "david@example.org",
					"subjects": ["Music", "Drama", "Maths"],
					"location": {
						"name": "Peckham",
						"coords": {"lat": 51.473938, "lng": -0.06875}
					}
				}, {
					"name": "Charlie",
					"email": "charlie@example.org",
					"subjects": ["Maths", "Physics"],
					"location": {
						"name": "Croydon",
						"coords": {"lat": 51.374667, "lng": -0.097504}
					}
				}, {
					"name": "Inigo",
					"email": "inigo@example.org",
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
			
			// Once the data is inserted, the testing can begin!
			async.parallel(tasks, function(err) {
				
				assert.ifError(err);
				
				// Method under test
				tutorApi.getSubjects(function(err, subjects) {
					
					assert.ifError(err);
					
					assert.equal(subjects.length, 5);
					
					assert.ok(subjects.indexOf('Music') > -1);
					assert.ok(subjects.indexOf('Drama') > -1);
					assert.ok(subjects.indexOf('Maths') > -1);
					assert.ok(subjects.indexOf('Physics') > -1);
					assert.ok(subjects.indexOf('Sword Fighting') > -1);
					
					done();
				});
			});
		});
	});
});