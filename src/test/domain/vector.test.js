(function() {
	"use strict";
	
	var expect = require('expect.js');
	var Vector = require('./vector');
	
	describe('A zero vector', function () {
		var vector = Vector.zero();
		
		it('has a magnitude of 0', function () {
			expect(vector.magnitude()).to.be(0);
		});
		
		it('normalizing it returns the same vector', function () {
			expect(vector.normalize()).to.be(vector);
		});
	});
	
	describe('A unit vector', function () {
		var vector = Vector.newVector(1, 0);
		
		it('has a magnitude of 1', function () {
			expect(vector.magnitude()).to.be(1);
		});
		
		it('normalizing it returns the same vector', function () {
			expect(vector.normalize()).to.eql(vector);
		});
	});
	
	describe('A vector of 3 x 4', function () {
		var vector = Vector.newVector(3, 4);
		
		it('has a magnitude of 5', function () {
			expect(vector.magnitude()).to.be(5);
		});
	});
}());
