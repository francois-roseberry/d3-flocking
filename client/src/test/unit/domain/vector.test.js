(function() {
	"use strict";
	
	var Vector = require('./vector');
	
	describe('A zero vector', function () {
		var vector = Vector.zero();
		
		beforeEach(function () {
			vector = Vector.zero();
		});
		
		it('has a magnitude of 0', function () {
			expect(vector.magnitude()).to.be(0);
		});
		
		it('normalizing it returns the same vector', function () {
			expect(vector.normalize()).to.be(vector);
		});
		
		it('distance with any vector is the magnitude of that vector', function() {
			var otherVector = Vector.newVector(3,4);
			expect(vector.distance(otherVector)).to.eql(otherVector.magnitude());
		});
	});
	
	describe('A unit vector', function () {
		var vector;
		
		beforeEach(function () {
			vector = Vector.newVector(1, 0);
		});
		
		it('has a magnitude of 1', function () {
			expect(vector.magnitude()).to.be(1);
		});
		
		it('normalizing it returns the same vector', function () {
			expect(vector.normalize()).to.eql(vector);
		});
	});
	
	describe('A vector of 3 x 4', function () {
		var vector;
		
		beforeEach(function () {
			vector = Vector.newVector(3, 4);
		});
		
		it('has a magnitude of 5', function () {
			expect(vector.magnitude()).to.be(5);
		});
		
		it('has a distance with itself of 0', function() {
			expect(vector.distance(vector)).to.be(0);
		});
	});
}());
