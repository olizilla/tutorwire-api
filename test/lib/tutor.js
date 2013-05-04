var db = require('../../lib/db');
var tutorApi = require('../../lib/tutor');
var async = require('async');

module.exports = {
	
	setUp: function(callback) {
		db.collection('tutors', function(err, tutors) {
			tutors.drop();
			callback();
		});
	},
	
	tearDown: function(callback) {
		// clean up
		callback();
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
	}
};