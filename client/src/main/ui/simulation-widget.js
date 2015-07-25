(function() {
	"use strict";
	
	var EditSimulationParamsWidget = require('./edit-simulation-params-widget');
	
	var precondition = require('./contract').precondition;
	
	exports.render = function(container, runSimulationTask, size) {
		precondition(container, 'SimulationWidget requires a container to render into');
		precondition(runSimulationTask, 'SimulationWidget requires a RunSimulationTask');
		precondition(size, 'SimulationWidget requires the size of the smulation');
		
		var svgContainer = d3.select(container[0])
			.append('svg')
			.classed('flocking-box', true)
			.attr('width', size.width)
			.attr('height', size.height);
			
		EditSimulationParamsWidget.render(container, runSimulationTask.editSimulationParamsTask());
		
		runSimulationTask.model().boids().subscribe(function (boids) {
			update(svgContainer, boids);
		});	
	};
	
	function update (svgContainer, boids) {
		var boidsUpdate = svgContainer.selectAll('g')
			.data(boids);
			
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
	}	
	
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
}());