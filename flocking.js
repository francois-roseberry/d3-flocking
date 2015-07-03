var WIDTH = 600;
var HEIGHT = 400;
var NB_BOIDS = 600;
var MAX_SPEED = 2;

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
		position: {
			x: Math.random() * WIDTH,
			y: Math.random() * HEIGHT
		},
		velocity: {
			x: (Math.random() * 2 * MAX_SPEED) - MAX_SPEED,
			y: (Math.random() * 2 * MAX_SPEED) - MAX_SPEED
		}
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
		
		flock(boids);
	});
}

function flock(neighboors) {
	var separation = separate(neighboors);
	var alignment = align(neighboors);
	var cohesion = cohere(neighboors);
}

function separate(neighboors) {}

function align(neighboors) {}

function cohere(neighboors) {}

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