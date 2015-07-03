var WIDTH = 600;
var HEIGHT = 400;
var NB_BOIDS = 100;
var MAX_SPEED = 2;
var NEIGHBOOR_RADIUS = 30;
var MAX_FORCE = 4;
var DESIRED_SEPARATION = 10;
var COHESION_WEIGHT = 1;
var SEPARATION_WEIGHT = 2;
var ALIGNMENT_WEIGHT = 1;

var boids = createBoids();

var container = d3.select('body')
	.append('div')
	.classed('sample-container', true);

container.append('h1')
	.text('Flocking sample with D3');

var svgContainer = container.append('svg')
	.classed('flocking-container', true)
	.attr('width', WIDTH)
	.attr('height', HEIGHT);

setInterval(updateSample(svgContainer), 20);

function createBoids() {
	var boids = [];
	for (var i = 0; i < NB_BOIDS; i++) {
		boids.push(createBoid());
	}
	return boids;
}

function createBoid() {
	return {
		position: vector(
			Math.random() * WIDTH,
			Math.random() * HEIGHT),
		velocity: vector(
			(Math.random() * 2 * MAX_SPEED) - MAX_SPEED,
			(Math.random() * 2 * MAX_SPEED) - MAX_SPEED)
	};
}

function updateSample(svgContainer) {
	return function () {
		updateBoids();
		renderBoids(svgContainer);
	}
}

function updateBoids() {
	_.each(boids, function (boid) {
		var acceleration = flock(boid, boids);
		boid.velocity = boid.velocity.add(acceleration).clamp(MAX_SPEED);
	
		if (boid.position.y() + boid.velocity.y() <= 1) { // Will exit by the top
			boid.position.set_y(1);
			boid.velocity.set_y(-boid.velocity.y());
		} else if (boid.position.y() + boid.velocity.y() >= HEIGHT - 1) { // Will exit by the bottom
			boid.position.set_y(HEIGHT - 1);
			boid.velocity.set_y(-boid.velocity.y());
		} else {
			boid.position.set_y(boid.position.y() + boid.velocity.y());
		}
		
		if (boid.position.x() + boid.velocity.x() <= 1) {
			boid.position.set_x(1);
			boid.velocity.set_x(-boid.velocity.x());
		} else if (boid.position.x() + boid.velocity.x() >= WIDTH - 1) {
			boid.position.set_x(WIDTH - 1);
			boid.velocity.set_x(-boid.velocity.x());
		} else {
			boid.position.set_x(boid.position.x() + boid.velocity.x());
		}
	});
}

function flock(boid, neighboors) {
	boid.separation = separate(boid, neighboors).multiply(SEPARATION_WEIGHT);
	boid.alignment = align(boid, neighboors).multiply(ALIGNMENT_WEIGHT);
	boid.cohesion = cohere(boid, neighboors).multiply(COHESION_WEIGHT);
	
	return boid.separation.add(boid.alignment).add(boid.cohesion);
}

function separate(boid, neighboors) {
	var mean = vector(0, 0);
	var count = 0;
	_.each(neighboors, function (neighboor) {
		var d = neighboor.position.distance(boid.position);
		if (d > 0 && d < DESIRED_SEPARATION) {
			var localMean = boid.position.subtract(neighboor.position).normalize().divide(d);
			mean = mean.add(localMean);
			count += 1;
		}
	});
	
	if (count > 0) {
		return mean.divide(count);
	}
	
	return mean;
}

function align(boid, neighboors) {
	var mean = vector(0, 0);
	var count = 0;
	_.each(neighboors, function (neighboor) {
		var d = neighboor.position.distance(boid.position);
		if (d > 0 && d < NEIGHBOOR_RADIUS) {
			mean = mean.add(neighboor.velocity);
			count += 1;
		}
	});
	
	if (count > 0) {
		return mean.divide(count).clamp(MAX_FORCE);
	}
	
	return mean;
}

function cohere(boid, neighboors) {
	var sum = vector(0, 0);
	var count = 0;
	_.each(neighboors, function (neighboor) {
		var d = neighboor.position.distance(boid.position);
		if (d > 0 && d < NEIGHBOOR_RADIUS) {
			sum = sum.add(neighboor.position);
			count += 1;
		}
	});
	
	if (count > 0) {
		return steer_to(boid, sum.divide(count));
	}
	
	return sum;
}

function steer_to(boid, target) {
	var desired = target.subtract(boid.position);
	var d = desired.magnitude();
	
	if (d > 0) {
		desired = desired.normalize();
		
		if (d < 100.0) {
			desired = desired.multiply(MAX_SPEED * (d / 100.0));
		} else {
			desired = desired.multiply(MAX_SPEED);
		}
		
		return desired.subtract(boid.velocity).clamp(MAX_FORCE);
	}
	
	return vector(0, 0);
}

function renderBoids(svgContainer) {
	var boidsUpdate = svgContainer.selectAll('g')
		.data(boids);
		
	var boidRepresentations = boidsUpdate
		.enter()
		.append('g');
		
	boidRepresentations
		.append('circle')
		.classed('boid', true);
		
	boidRepresentations
		.append('line')
		.classed('cohesion', true);
			
	boidRepresentations
		.append('line')
		.classed('alignment', true);
		
	boidRepresentations
		.append('line')
		.classed('separation', true);
		
	boidsUpdate.selectAll('.boid')
		.attr({
				'cx': function (boid) { return boid.position.x(); },
				'cy': function (boid) { return boid.position.y(); }
		});	
		
	renderVectors(boidsUpdate);
}

function renderVectors(boidsUpdate) {
	renderVector(boidsUpdate, 'cohesion');
	renderVector(boidsUpdate, 'alignment');
	renderVector(boidsUpdate, 'separation');
}

function renderVector(boidsUpdate, name) {
	boidsUpdate
		.selectAll('.' + name)
		.attr({
			'x1': function (boid) { return boid.position.x(); },
			'y1': function (boid) { return boid.position.y(); },
			'x2': function (boid) { return boid.position.x() + boid[name].x() * 6; },
			'y2': function (boid) { return boid.position.y() + boid[name].y() * 6; }
		});
}