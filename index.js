var meta = require('./package.json');
var config = require('./config.js');
var restify = require('restify');

var app = restify.createServer({
	name: meta.title,
	version: meta.version
});

var tutor = require('./lib/tutor-rest');

app.put('/tutor', tutor.putOne);
app.get('/tutor/:id', tutor.getOne);
app.get('/tutor', tutor.getAll);
// app.del('/tutor/:id', tutor.del);

// app.put('/subject/:name', subject.put);
// app.get('/subject/:name', subject.getOne);
// app.get('/subject/', subject.getAll);
// app.del('/subject/:name', subject.del);

function index(req, res, next) {
	res.send('hello ' + req.params);
}
app.get('/', index);

app.listen(config.app.port, function() {
	console.log('%s listening at %s', app.name, app.url);
});
