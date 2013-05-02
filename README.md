Tutor Wire API
==============

**A work in progress on how best to node all the things**

Getting Started
---------------

Requries:
- NodeJS
- Mongo

Uses:
- [Cradle] for Couch access
- [Restify] for the http plumbing

Update config.js and then run index.js:

```shell
	node index.js
```

Test it out with CURL or similar:

```shell
	curl -i http://localhost:9000/tutor/ -X PUT -d { "name": "Charlie" } -H "Content-type: application/json"

	curl -i http://localhost:9000/tutor/:id -X GET
```


[Cradle]: https://github.com/cloudhead/cradle
[Restify]: https://github.com/mcavage/node-restify