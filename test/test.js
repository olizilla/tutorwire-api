/* 
Mocha test harness, for debugging when things get really weird.
Normally a `grunt test` should suffice

Usage:
	node test/test.js
*/

var Mocha = require('mocha');

var mocha = new Mocha

mocha.reporter('spec').ui('bdd');

mocha.addFile( __dirname + '/lib/tutor.js');

mocha.run(function(){
    console.log('Done...');
})
