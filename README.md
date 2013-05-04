Tutor Wire API
==============

**A work in progress on how best to node all the things**

Getting Started
---------------

Requries:
- NodeJS
- MongoDB

Uses:
- [ExpressJS] for the http plumbing

Update config.js and then run index.js:

```shell
node index
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


[ExpressJS]: http://expressjs.com/