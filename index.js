var meta = require('./package.json');
var config = require('./config.js');
var express = require('express');

var app = express();

var tutorApi = require('./lib/tutor');

app.get('/tutor/:id', getTutorById);
app.get('/tutor', getAllTutors);
app.put('/tutor', addTutor);
app.post('/tutor', addTutor);

function getTutorById(req, res){
	var id = req.params.id;
	
	tutorApi.getOne(id, function(err, tutor){
		res.json(tutor);
	});
}

function getAllTutors(req, res){
	tutorApi.getAll(function(err, tutors){
		res.json(tutors);
	});
}

function addTutor(req, res){
	var rawTutor = req.body;
	tutorApi.add(rawTutor, function(err, tutor){
		res.json(tutor);
	});
}

app.listen(config.app.port, function() {
	console.log('listening at %s', config.app.port);
});