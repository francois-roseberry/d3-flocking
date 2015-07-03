var WIDTH = 600;
var HEIGHT = 400;
var NB_BOIDS = 600;
var MAX_SPEED = 2;
var NEIGHBOOR_RADIUS = 5;

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

function vector() {
	return { x: 0, y: 0 };
}

function vector(x, y) {
	return { x: x, y: y};
}

function distance(v1, v2) {
	var dx = Math.abs(v1.x - v2.x);
	var dy = Math.abs(v1.y - v2.y);
	return Math.sqrt(dx*dx + dy*dy);
}

function add(v1, v2) {
	return vector(v1.x+v2.x, v1.y+v2.y);
}

function updateSample(svgContainer) {
	return function () {
		updateBoids();
		renderBoids(svgContainer);
	}
}

function updateBoids() {
	_.each(boids, function (boid) {
		if (boid.position.y + boid.velocity.y <= 1) { // Will exit by the top
			boid.position.y = 1;
			boid.velocity.y = -boid.velocity.y;
		} else if (boid.position.y + boid.velocity.y >= HEIGHT - 1) { // Will exit by the bottom
			boid.position.y = HEIGHT - 1;
			boid.velocity.y = -boid.velocity.y;
		} else {
			boid.position.y += boid.velocity.y;
		}
		
		if (boid.position.x + boid.velocity.x <= 1) {
			boid.position.x = 1;
			boid.velocity.x = -boid.velocity.x;
		} else if (boid.position.x + boid.velocity.x >= WIDTH - 1) {
			boid.position.x = WIDTH - 1;
			boid.velocity.x = -boid.velocity.x;
		} else {
			boid.position.x += boid.velocity.x;
		}
		
		flock(boid, boids);
	});
}

function flock(boid, neighboors) {
	var separation = separate(neighboors);
	var alignment = align(neighboors);
	var cohesion = cohere(boid, neighboors);
}

function separate(neighboors) {}

function align(neighboors) {}

function cohere(boid, neighboors) {
	var sum = vector();
	_.each(neighboors, function (neighboor) {
		var d = distance(neighboor.position, boid.position);
		if (d > 0 && d < NEIGHBOOR_RADIUS) {
			sum = add(sum, boid.position);
		}
	});
}

function renderBoids(svgContainer) {
	var boidsUpdate = svgContainer.selectAll('circle')
		.data(boids);
		
	boidsUpdate
		.enter()
		.append('circle')
		.attr('r', 1)
		.attr('fill', 'black');
		
	boidsUpdate
		.attr({ 'cx': function (boid) { return boid.position.x; },
			    'cy': function (boid) { return boid.position.y; }
		});
		
}