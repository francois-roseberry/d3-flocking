(function() {
	"use strict";
	
	var _ = require('underscore');
	
	var Vector = require('./vector');
	
	var precondition = require('./contract').precondition;
	
	exports.newBoid = function (position, velocity, size) {
		precondition(position, 'A boid requires an initial position');
		precondition(velocity, 'A boid requires an initial velocity');
		precondition(size, 'A boid requires the size of its container');
		
		return new Boid(position, velocity, size);
	};

	function Boid(position, velocity, size) {
		this._position = position;
		this._velocity = velocity;
		this._size = size;
		
		this.separation = Vector.zero();
		this.alignment = Vector.zero();
		this.cohesion = Vector.zero();
	}

	Boid.prototype.x = function () {
		return this._position.x();
	};

	Boid.prototype.y = function () {
		return this._position.y();
	};

	Boid.prototype.update = function (boids, params) {
		precondition(boids, 'Updating a boid requires a list of all the boids around');
		precondition('Updating a boid requires a params object to hold the parameters for the flocking algorithm');
		
		var acceleration = flock(this, boids, params);
		this._velocity = this._velocity.add(acceleration).clamp(params.maxSpeed);

		move(this);	
	};
	
	function move(self) {
		if (self._position.y() + self._velocity.y() <= 1) { // Will exit by the top
			self._position.setY(1);
			self._velocity.setY(-self._velocity.y());
		} else if (self._position.y() + self._velocity.y() >= self._size.height - 1) { // Will exit by the bottom
			self._position.setY(self._size.height - 1);
			self._velocity.setY(-self._velocity.y());
		} else {
			self._position.setY(self._position.y() + self._velocity.y());
		}
		
		if (self._position.x() + self._velocity.x() <= 1) {
			self._position.setX(1);
			self._velocity.setX(-self._velocity.x());
		} else if (self._position.x() + self._velocity.x() >= self._size.width - 1) {
			self._position.setX(self._size.width - 1);
			self._velocity.setX(-self._velocity.x());
		} else {
			self._position.setX(self._position.x() + self._velocity.x());
		}
	}
	
	function flock (self, neighboors, params) {
		self.separation = separate(self, neighboors, params).multiply(params.weights.separation);
		self.alignment = align(self, neighboors, params).multiply(params.weights.alignment);
		self.cohesion = cohere(self, neighboors, params).multiply(params.weights.cohesion);
			
		return self.separation.add(self.alignment).add(self.cohesion);
	}
	
	function separate (self, neighboors, params) {
		var mean = Vector.zero();
		var count = 0;
		_.each(neighboors, function (neighboor) {
			var d = neighboor._position.distance(self._position);
			if (d > 0 && d < params.desiredSeparation) {
				var localMean = self._position.subtract(neighboor._position).normalize().divide(d);
				mean = mean.add(localMean);
				count += 1;
			}
		});
		
		if (count > 0) {
			return mean.divide(count);
		}
		
		return mean;
	}
	
	function align (self, neighboors, params) {
		var mean = Vector.zero();
		var count = 0;
		_.each(neighboors, function (neighboor) {
			var d = neighboor._position.distance(self._position);
			if (d > 0 && d < params.neighboorRadius) {
				mean = mean.add(neighboor._velocity);
				count += 1;
			}
		});
		
		if (count > 0) {
			return mean.divide(count).clamp(params.maxForce);
		}
		
		return mean;
	}
	
	function cohere (self, neighboors, params) {
		var sum = Vector.zero();
		var count = 0;
		_.each(neighboors, function (neighboor) {
			var d = neighboor._position.distance(self._position);
			if (d > 0 && d < params.neighboorRadius) {
				sum = sum.add(neighboor._position);
				count += 1;
			}
		});
		
		if (count > 0) {
			return steerTo(self, sum.divide(count), params);
		}
		
		return sum;
	}
	
	function steerTo (self, target, params) {
		var desired = target.subtract(self._position);
		var d = desired.magnitude();
		
		if (d > 0) {
			desired = desired.normalize();
			
			if (d < 100.0) {
				desired = desired.multiply(params.maxSpeed * (d / 100.0));
			} else {
				desired = desired.multiply(params.maxSpeed);
			}
			
			return desired.subtract(self._velocity).clamp(params.maxForce);
		}
		
		return Vector.zero();
	}
}());