var assert = require('assert');
var rewire = require('rewire');
 
var index = rewire("./index.js"); 

describe('Index Tests', function() {
	describe('getStudentIndex Tests', function() {
		var madmen = {'screen_name': 'Don Draper'}; 
		var breakingbad = {'screen_name': 'Walter White'}; 
		var soprano = {'screen_name': 'Tony Soprano'}; 
		var getStudentIndex = index.__get__('getStudentIndex'); 
		var studentList = [madmen, breakingbad, soprano]; 

		it('student not in list', function(done) {
			assert.equal(getStudentIndex('Will Graham', studentList), -1); 
			done(); 
		});

		it('student in list', function(done) {
			assert.equal(getStudentIndex('Don Draper', studentList), 0); 
			done(); 
		}); 		
	}); 
});

 

