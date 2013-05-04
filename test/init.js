var db = require('../lib/db');
var nodeunit = require('nodeunit');

module.exports = {
	'Waiting for DB to connect before testing starts...': function(test) {
		
		db.on('open', function() {
			
			// Ensure the process exits when the tests are complete
			nodeunit.on('complete', function() {
				db.close();
			});
			
			test.done();
		});
	}
};

