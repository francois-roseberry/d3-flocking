var WIDTH = 600;
var HEIGHT = 400;
var NB_BOIDS = 600;
var MAX_SPEED = 2;
var NEIGHBOOR_RADIUS = 20;
var MAX_FORCE = 4;

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
	boid.separation = separate(neighboors);
	boid.alignment = align(neighboors);
	boid.cohesion = cohere(boid, neighboors);
	
	return boid.separation.add(boid.alignment).add(boid.cohesion);
}

function separate(neighboors) { return vector(0, 0); }

function align(neighboors) { return vector(0, 0); }

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
			desired = desired.multiply(MAX_SPEED * (d/100.0));
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
		.attr('r', 1)
		.attr('fill', 'black');
		
	boidRepresentations
		.append('line')
		.attr({
			'stroke': 'red',
			'stroke-width': 1
			});
		
	boidsUpdate.selectAll('circle')
		.attr({
				'cx': function (boid) { return boid.position.x(); },
				'cy': function (boid) { return boid.position.y(); }
		});	
		
	boidsUpdate.selectAll('line')
		.attr({
			'x1': function (boid) { return boid.position.x(); },
			'y1': function (boid) { return boid.position.y(); },
			'x2': function (boid) { return boid.position.x() + boid.cohesion.x() * 6; },
			'y2': function (boid) { return boid.position.y() + boid.cohesion.y() * 6; }
		});
}