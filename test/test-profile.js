var assert = require('assert'); 
var rewire = require('rewire');  
//var expect = require('chai').expect; 

var profile = rewire("./public/scripts/profile.js"); 

describe('Profile Tests', function() {
	describe('switchUserType Tests', function() {	
		
		before(function () {
			this.jsdom = require('jsdom-global')(); 
		}); 

		after(function () {
  			this.jsdom(); 
		}); 
	
		var currentUserType = profile.__set__('currentUserType', "Owner"); 
		var optionalUserType = profile.__set__('optionalUserType', "Visitor"); 
		var switchUserType = profile.__get__('switchUserType'); 

		it('switch from Owner to Visitor', function(done) { 
			document.body.innerHTML = '<div id="currentUserType">Hi</div>';
			switchUserType(); 
			assert.equal(profile.__get__('currentUserType'), "Visitor"); 
			assert.equal(profile.__get__('optionalUserType'), "Owner");
			done();   			
		});

		it('switch from Visitor to Owner', function(done) {
			switchUserType(); 
			assert.equal(profile.__get__('currentUserType'), "Owner"); 
			assert.equal(profile.__get__('optionalUserType'), "Visitor"); 
			done(); 
		});  	
	}); 
}); 

