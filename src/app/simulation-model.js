(function() {
	"use strict";
	
	var Vector = require('./vector');
	var Boid = require('./boid');
	
	exports.newModel = function(params, size) {
		return new SimulationModel(params, size);
	};

	function SimulationModel(params, size) {
		this._boids = createBoids(params, size);
		this._boidsUpdated = new Rx.BehaviorSubject(this._boids);
	}
	
	function createBoids(params, size) {
		var boids = [];
		for (var i = 0; i < params.nbBoids; i++) {
			boids.push(createBoid(params, size));
		}
		return boids;
	}

	function createBoid(params, size) {
		return Boid.newBoid(
			Vector.newVector(
				Math.random() * size.width,
				Math.random() * size.height),
			Vector.newVector(
				(Math.random() * 2 * params.maxSpeed) - params.maxSpeed,
				(Math.random() * 2 * params.maxSpeed) - params.maxSpeed),
			size
		);
	}

	SimulationModel.prototype.boids = function () {
		return this._boidsUpdated.asObservable();
	};

	SimulationModel.prototype.update = function (params) {
		var self = this;
		_.each(this._boids, function (boid) {
			boid.update(self._boids, params);
		});
		this._boidsUpdated.onNext(this._boids);
	};
}());