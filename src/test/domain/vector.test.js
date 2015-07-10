(function() {
	"use strict";
	
	var expect = require('expect.js');
	var Vector = require('./vector');
	
	describe('A unit vector', function () {
		var vector = Vector.newVector(1, 0);
		
		it('should have a magnitude of 1', function () {
			expect(vector.magnitude()).to.be(1);
		});
	});
}());