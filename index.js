var meta = require('./package.json');
var config = require('config');
var express = require('express');
var tutorApi = require('./lib/tutor');
var util = require('util');

var app = express();

app.use(express.bodyParser());

app.get('/tutor/:id', getTutorById);
app.get('/tutor', getAllTutors);
app.post('/tutor', addTutor);
app.put('/tutor/:id', updateTutor);
app.get('/tutor/for/:subject', getTutorBySubject);
app.get('/tutor/near/:lng,:lat', getTutorNear);
app.get('/tutor/subjects', getTutorSubjects);

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
	})
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

function getTutorSubjects(req, res) {
	
	tutorApi.getSubjects(function(err, subjects) {
		if(errorsHappened(err, req, res, 'Failed to get tutor subjects')) {
			return;
		}
		
		res.json(subjects);
	});
}

app.listen(config.app.port, function() {
	console.log('listening at %s', config.app.port);
});



function errorsHappened(err, req, res, msg) {

	if (!err) { return false; }

	console.error(msg, err);

	if (util.isError(err)) {
		console.error(err.stack);
	}

	res.json(500, {err: msg});

	return true;
};