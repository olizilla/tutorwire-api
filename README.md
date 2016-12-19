Tutor Wire API [![Build Status](https://travis-ci.org/olizilla/tutorwire-api.png?branch=master)](https://travis-ci.org/olizilla/tutorwire-api) [![Dependency Status](https://david-dm.org/olizilla/tutorwire-api.png)](https://david-dm.org/olizilla/tutorwire-api) [![Coverage Status](https://coveralls.io/repos/olizilla/tutorwire-api/badge.png?branch=master)](https://coveralls.io/r/olizilla/tutorwire-api)
==============

**A work in progress on how best to node all the things**

Getting Started
---------------

Requries:
- NodeJS
- MongoDB

Uses:
- [ExpressJS] for the http plumbing
- [Grunt](http://gruntjs.com) to lint, run tests and produce coverage reports

### Configuration

Tutorwire API is configured according to JSON files in the [config](https://github.com/olizilla/tutorwire-api/tree/master/config) dir. Configuration is based on the NODE_ENV environment variable. Default configuration options can be found in [config/default.json](https://github.com/olizilla/tutorwire-api/blob/master/config/default.json). See [node-config module docs](http://lorenwest.github.io/node-config/latest/) for more information.

### Running

To start the API using the default configuration run:

```shell
node index
```

To use a specific configuration, for example `production.json` run:

```shell
NODE_ENV=production node index
```

Use the [forever](https://npmjs.org/package/forever) module to start the process as a daemon: 

```sh
NODE_ENV=xxx forever start index.js
```

Test it out with CURL or similar:

```shell
# Create
curl -i http://localhost:9000/tutor/ -X POST -d '{ "name": "Charlie", "subjects": ["Maths", "Physics"], "location": {"name": "Croydon", "coords": {"lat": 51.374667, "lng": -0.097504}} }' -H "Content-type: application/json"
curl -i http://localhost:9000/tutor/ -X POST -d '{ "name": "David", "subjects": ["Music", "Drama", "Maths"], "location": {"name": "Peckham", "coords": {"lat": 51.473938, "lng": -0.06875}} }' -H "Content-type: application/json"
curl -i http://localhost:9000/tutor/ -X POST -d '{ "name": "Inigo", "subjects": ["Sword Fighting"], "location": {"name": "Hoxton", "coords": {"lat": 51.530739, "lng": -0.076861}} }' -H "Content-type: application/json"

# Retrieve
curl -i http://localhost:9000/tutor/:id -X GET

# Update
curl -i http://localhost:9000/tutor/:id -X PUT -d '{ "name": "Chaaarlie" }' -H "Content-type: application/json"
```

Unit Testing
------------

Tests are performed using [Mocha](http://mochajs.org/). To run the tests:

```shell
npm test
```

Continuous Integration
----------------------

[Travis CI](https://travis-ci.org/olizilla/tutorwire-api) runs the `travis` task when new code is pushed to the repo. The task lints the JavaScript, runs the tests, creates and submits the [coverage report](#coverage).

Coverage
--------

Coverage is tracked by [coveralls.io](https://coveralls.io/r/olizilla/tutorwire-api). Coverage reports are created by the [grunt-mocha-cov](https://github.com/mmoulton/grunt-mocha-cov) plugin. The task `mochacov:coveralls` creates and submits the coverage report to [coveralls.io](https://coveralls.io/). It will only submit the report successfully when run by Travis.

Noteworthy configuration is the `scripts.blanket.pattern` config in the `package.json` file. Before coverage reports can be generated, blanket needs to process the source code to create "instrumented" versions that allow coverage data to be captured. The instrumented code is what is run by the test framework. The `scripts.blanket.pattern` config essentially specifies what files should be considered for coverage.


[ExpressJS]: http://expressjs.com/
