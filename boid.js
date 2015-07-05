function boid(position, velocity) {
	return {
		_position: position,
		_velocity: velocity,
		
		x: function () { return this._position.x(); },
		y: function () { return this._position.y(); },
		update: function (boids, params) {
			var acceleration = this.flock(boids, params);
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
		},
		flock: function (neighboors, params) {
			this.separation = this.separate(neighboors, params).multiply(params.weights.separation);
			this.alignment = this.align(neighboors, params).multiply(params.weights.alignment);
			this.cohesion = this.cohere(neighboors, params).multiply(params.weights.cohesion);
			
			return this.separation.add(this.alignment).add(this.cohesion);
		},
		separate: function (neighboors, params) {
			var mean = vector(0, 0);
			var count = 0;
			var self = this;
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
		},
		align: function (neighboors, params) {
			var mean = vector(0, 0);
			var count = 0;
			var self = this;
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
		},
		cohere: function (neighboors, params) {
			var sum = vector(0, 0);
			var count = 0;
			var self = this;
			_.each(neighboors, function (neighboor) {
				var d = neighboor._position.distance(self._position);
				if (d > 0 && d < params.neighboorRadius) {
					sum = sum.add(neighboor._position);
					count += 1;
				}
			});
			
			if (count > 0) {
				return this.steer_to(sum.divide(count), params);
			}
			
			return sum;
		},
		steer_to: function (target, params) {
			var desired = target.subtract(this._position);
			var d = desired.magnitude();
			
			if (d > 0) {
				desired = desired.normalize();
				
				if (d < 100.0) {
					desired = desired.multiply(params.maxSpeed * (d / 100.0));
				} else {
					desired = desired.multiply(params.maxSpeed);
				}
				
				return desired.subtract(this._velocity).clamp(params.maxForce);
			}
			
			return vector(0, 0);
		}
	};
}