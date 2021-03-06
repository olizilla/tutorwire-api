var meta = require('./package.json');
var config = require('config');
var express = require('express');
var tutorApi = require('./lib/tutor');
var util = require('util');

var app = express();

app.use(express.methodOverride());

// https://gist.github.com/cuppster/2344435
// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(204); // olizilla: Edited to 204, as we're not going to send any content
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.logger());

app.get('/tutor/:id', getTutorById);
app.get('/tutor', getAllTutors);
app.post('/tutor', addTutor);
app.put('/tutor/:id', updateTutor);
app.get('/tutors/for/:subject', getTutorBySubject);
app.get('/tutors/near/:lng,:lat', getTutorNear);
app.get('/tutor/subjects', getSubjects);

function getTutorById(req, res){
	var id = req.params.id;
	
	tutorApi.getOne(id, function(err, tutor){
		if(errorsHappened(err, req, res, 'Failed to get tutor ' + id)) {
			return;
		}
		
		res.json(tutor);
	});
}

function getAllTutors(req, res){
	tutorApi.getAll(function(err, tutors){
		if(errorsHappened(err, req, res, 'Failed to get all tutors')) {
			return;
		}
		
		res.json(tutors);
	});
}

function addTutor(req, res){
	var rawTutor = req.body;
	
	tutorApi.add(rawTutor, function(err, tutor){
		if(errorsHappened(err, req, res, 'Failed to add tutor')) {
			return;
		}

		res.json(tutor);
	});
}

function updateTutor(req, res) {
	var rawTutor = req.body;
	
	tutorApi.update(req.params.id, rawTutor, function(err, tutor){
		if(errorsHappened(err, req, res, 'Failed to update tutor')) {
			return;
		}
		
		res.json(tutor);
	});
}

function getTutorBySubject(req, res) {
	var subject = req.params.subject;
	
	tutorApi.getBySubject(subject, function(err, results) {
		if(errorsHappened(err, req, res, 'Search failed for ' + subject)) {
			return;
		}

		res.json(results);
	});
}

function getTutorNear(req, res) {
	var coords = {lat: req.params.lat, lng: req.params.lng};

	tutorApi.getNear(coords, function(err, tutors) {
		if(errorsHappened(err, req, res, 'Failed to get tutors near ' + coords.lat + ',' + coords.lng)) {
			return;
		}

		res.json(tutors);
	});
}

function getSubjects(req, res) {
	
	tutorApi.getSubjects(function(err, subjects) {
		if(errorsHappened(err, req, res, 'Failed to get tutor subjects')) {
			return;
		}
		
		res.json(subjects);
	});
}

function errorsHappened(err, req, res, msg) {

	if (!err) { return false; }

	console.error(msg, err);

	if (util.isError(err)) {
		console.error(err.stack);
	}

	res.json(500, {err: msg});

	return true;
}

app.listen(config.app.port, function() {
	process.title = 'tutorwire:' + config.app.port;
	console.log('tutorwire-api listening on %s', config.app.port);
});
