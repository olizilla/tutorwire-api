Tutor Wire API [![Dependency Status](https://david-dm.org/olizilla/tutorwire-api.png)](https://david-dm.org/olizilla/tutorwire-api)
==============

**A work in progress on how best to node all the things**

Getting Started
---------------

Requries:
- NodeJS
- MongoDB

Uses:
- [ExpressJS] for the http plumbing

### Configuration

Tutorwire API is configured according to JSON files in the [config] dir. Configuration is based on the NODE_ENV environment variable. Default configuration options can be found in [config/defaults.json]. See [node-config module docs](http://lorenwest.github.io/node-config/latest/) for more information.

### Running

To start the API using the default configuration run:

```shell
node index
```

To use a specific configuration, for example `production.json` run:

```shell
NODE_ENV=production node index
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

Tests are performed using nodeunit. To run the tests:

```shell
npm test
```

This command sets the NODE_ENV variable to "test" and then uses the nodeunit test runner to run the tests.


[ExpressJS]: http://expressjs.com/