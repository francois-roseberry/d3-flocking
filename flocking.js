var SIZE = {
	width: 600,
	height: 400
};
var PARAMS = {
	nbBoids: 100,
	neighboorRadius: 30,
	desiredSeparation: 5,
	maxSpeed: 2,
	maxForce: 4,
	weights: {
		cohesion: 1,
		alignment: 1,
		separation: 4
	}
};

$(document).ready(startSample(PARAMS));

function startSample(params) {
	var boids = createBoids(params);

	var container = d3.select('body')
		.append('div')
		.classed('sample-container', true);

	container.append('h1')
		.text('Flocking sample with D3');

	var svgContainer = container.append('svg')
		.classed('box', true)
		.attr('width', SIZE.width)
		.attr('height', SIZE.height);
		
	var controlsContainer = container.append('div');
	renderControls(controlsContainer, params);

	Rx.Observable.timer(0, 20)
		.subscribe(updateSample(svgContainer, boids));
}

function createBoids(params) {
	var boids = [];
	for (var i = 0; i < params.nbBoids; i++) {
		boids.push(createBoid(params));
	}
	return boids;
}

function createBoid(params) {
	return boid(
		vector(
			Math.random() * SIZE.width,
			Math.random() * SIZE.height),
		vector(
			(Math.random() * 2 * params.maxSpeed) - params.maxSpeed,
			(Math.random() * 2 * params.maxSpeed) - params.maxSpeed)
	);
}

function updateSample(svgContainer, boids) {
	return function () {
		updateBoids(boids, PARAMS);
		updateRendering(svgContainer, boids);
	}
}

function updateBoids(boids, params) {
	_.each(boids, function (boid) {
		boid.update(boids, params);
	});
}

function updateRendering(svgContainer, boids) {
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