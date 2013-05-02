// Application config object
module.exports = {
	app: {
		port: 9000
	},
	db: {
		name: 'tutorwire',
		host: '127.0.0.1',
		port: 27017,
		opts: {
			auto_reconnect: true,
			poolSize: 8
		}
	}
};