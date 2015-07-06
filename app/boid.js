function boid(position, velocity) {
	return {
		_position: position,
		_velocity: velocity,
		
		x: function () { return this._position.x(); },
		y: function () { return this._position.y(); },
		update: function (boids, params) {
			var acceleration = flock(this, boids, params);
			this._velocity = this._velocity.add(acceleration).clamp(params.maxSpeed);
		
			if (this._position.y() + this._velocity.y() <= 1) { // Will exit by the top
				this._position.set_y(1);
				this._velocity.set_y(-this._velocity.y());
			} else if (this._position.y() + this._velocity.y() >= SIZE.height - 1) { // Will exit by the bottom
				this._position.set_y(SIZE.height - 1);
				this._velocity.set_y(-this._velocity.y());
			} else {
				this._position.set_y(this._position.y() + this._velocity.y());
			}
			
			if (this._position.x() + this._velocity.x() <= 1) {
				this._position.set_x(1);
				this._velocity.set_x(-this._velocity.x());
			} else if (this._position.x() + this._velocity.x() >= SIZE.width - 1) {
				this._position.set_x(SIZE.width - 1);
				this._velocity.set_x(-this._velocity.x());
			} else {
				this._position.set_x(this._position.x() + this._velocity.x());
			}
		}
	};
	
	function flock (self, neighboors, params) {
		self.separation = separate(self, neighboors, params).multiply(params.weights.separation);
		self.alignment = align(self, neighboors, params).multiply(params.weights.alignment);
		self.cohesion = cohere(self, neighboors, params).multiply(params.weights.cohesion);
			
		return self.separation.add(self.alignment).add(self.cohesion);
	}
	
	function separate (self, neighboors, params) {
		var mean = new Vector(0, 0);
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
		var mean = new Vector(0, 0);
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
		var sum = new Vector(0, 0);
		var count = 0;
		_.each(neighboors, function (neighboor) {
			var d = neighboor._position.distance(self._position);
			if (d > 0 && d < params.neighboorRadius) {
				sum = sum.add(neighboor._position);
				count += 1;
			}
		});
		
		if (count > 0) {
			return steer_to(self, sum.divide(count), params);
		}
		
		return sum;
	}
	
	function steer_to (self, target, params) {
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
		
		return new Vector(0, 0);
	}
}