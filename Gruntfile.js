module.exports = function(grunt) {
	
	grunt.initConfig({
		
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		
		mochacov: {
			test: {
				options: {
					reporter: 'spec'
				}
			},
			coveralls: {
				options: {
					coveralls: {
						serviceName: 'travis-ci'
					}
				}
			},
			options: {
			  files: 'test/**/*.js'
			}
		},
		
		jshint: {
			files: 'lib/**/*.js'
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-mocha-cov');
	
	grunt.registerTask('default', ['test']);
	grunt.registerTask('test', ['jshint', 'env:test', 'mochacov:test']);
	grunt.registerTask('travis', ['jshint', 'env:test', 'mochacov:test', 'mochacov:coveralls']);
};