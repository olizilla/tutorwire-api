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
	curl -i http://localhost:9000/tutor/ -X POST -d '{ "name": "Charlie" }' -H "Content-type: application/json"
	
	# Retrieve
	curl -i http://localhost:9000/tutor/:id -X GET
	
	# Update
	curl -i http://localhost:9000/tutor/:id -X PUT -d '{ "name": "Chaaarlie" }' -H "Content-type: application/json"
```


[ExpressJS]: http://expressjs.com/