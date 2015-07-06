function SimulationWidget(container, model, size) {
	this._svgContainer = container.append('svg')
		.classed('box', true)
		.attr('width', size.width)
		.attr('height', size.height);
		
	this._model = model;
}

SimulationWidget.prototype.update = function () {
	var boidsUpdate = this._svgContainer.selectAll('g')
		.data(this._model.boids());
		
	var boidRepresentations = boidsUpdate
		.enter()
		.append('g');
		
	boidRepresentations
		.append('circle')
		.classed('boid', true);
	
	createVectors(boidRepresentations);
		
	boidsUpdate
		.attr('transform', function (boid) { return 'translate(' + boid.x() + ',' + boid.y() + ')'; });
		
	renderVectors(boidsUpdate);
	
	function createVectors(boids) {
		createVector(boids, 'cohesion');
		createVector(boids, 'alignment');
		createVector(boids, 'separation');
	}

	function createVector(boids, name) {
		boids.append('line')
			.classed(name, true)
			.attr({'x1': 0, 'y1': 0});
	}

	function renderVectors(boids) {
		renderVector(boids, 'cohesion');
		renderVector(boids, 'alignment');
		renderVector(boids, 'separation');
	}

	function renderVector(boids, name) {
		boids.selectAll('.' + name)
			.attr({
				'x2': function (boid) { return boid[name].x() * 6; },
				'y2': function (boid) { return boid[name].y() * 6; }
			});
	}
};