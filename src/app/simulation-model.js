function SimulationModel(params, size) {
	this._boids = createBoids();
	this._boidsUpdated = new Rx.BehaviorSubject(this._boids);
	
	function createBoids() {
		var boids = [];
		for (var i = 0; i < params.nbBoids; i++) {
			boids.push(createBoid());
		}
		return boids;
	}

	function createBoid() {
		return new Boid(
			new Vector(
				Math.random() * size.width,
				Math.random() * size.height),
			new Vector(
				(Math.random() * 2 * params.maxSpeed) - params.maxSpeed,
				(Math.random() * 2 * params.maxSpeed) - params.maxSpeed)
		);
	}
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