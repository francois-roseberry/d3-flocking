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
	return {
		position: vector(
			Math.random() * SIZE.width,
			Math.random() * SIZE.height),
		velocity: vector(
			(Math.random() * 2 * params.maxSpeed) - params.maxSpeed,
			(Math.random() * 2 * params.maxSpeed) - params.maxSpeed)
	};
}

function updateSample(svgContainer, boids) {
	return function () {
		updateBoids(boids, PARAMS);
		updateRendering(svgContainer, boids);
	}
}

function updateBoids(boids, params) {
	_.each(boids, function (boid) {
		var acceleration = flock(boid, boids, params);
		boid.velocity = boid.velocity.add(acceleration).clamp(params.maxSpeed);
	
		if (boid.position.y() + boid.velocity.y() <= 1) { // Will exit by the top
			boid.position.set_y(1);
			boid.velocity.set_y(-boid.velocity.y());
		} else if (boid.position.y() + boid.velocity.y() >= SIZE.height - 1) { // Will exit by the bottom
			boid.position.set_y(SIZE.height - 1);
			boid.velocity.set_y(-boid.velocity.y());
		} else {
			boid.position.set_y(boid.position.y() + boid.velocity.y());
		}
		
		if (boid.position.x() + boid.velocity.x() <= 1) {
			boid.position.set_x(1);
			boid.velocity.set_x(-boid.velocity.x());
		} else if (boid.position.x() + boid.velocity.x() >= SIZE.width - 1) {
			boid.position.set_x(SIZE.width - 1);
			boid.velocity.set_x(-boid.velocity.x());
		} else {
			boid.position.set_x(boid.position.x() + boid.velocity.x());
		}
	});
}

function flock(boid, neighboors, params) {
	boid.separation = separate(boid, neighboors, params).multiply(params.weights.separation);
	boid.alignment = align(boid, neighboors, params).multiply(params.weights.alignment);
	boid.cohesion = cohere(boid, neighboors, params).multiply(params.weights.cohesion);
	
	return boid.separation.add(boid.alignment).add(boid.cohesion);
}

function separate(boid, neighboors, params) {
	var mean = vector(0, 0);
	var count = 0;
	_.each(neighboors, function (neighboor) {
		var d = neighboor.position.distance(boid.position);
		if (d > 0 && d < params.desiredSeparation) {
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

function align(boid, neighboors, params) {
	var mean = vector(0, 0);
	var count = 0;
	_.each(neighboors, function (neighboor) {
		var d = neighboor.position.distance(boid.position);
		if (d > 0 && d < params.neighboorRadius) {
			mean = mean.add(neighboor.velocity);
			count += 1;
		}
	});
	
	if (count > 0) {
		return mean.divide(count).clamp(params.maxForce);
	}
	
	return mean;
}

function cohere(boid, neighboors, params) {
	var sum = vector(0, 0);
	var count = 0;
	_.each(neighboors, function (neighboor) {
		var d = neighboor.position.distance(boid.position);
		if (d > 0 && d < params.neighboorRadius) {
			sum = sum.add(neighboor.position);
			count += 1;
		}
	});
	
	if (count > 0) {
		return steer_to(boid, sum.divide(count), params);
	}
	
	return sum;
}

function steer_to(boid, target, params) {
	var desired = target.subtract(boid.position);
	var d = desired.magnitude();
	
	if (d > 0) {
		desired = desired.normalize();
		
		if (d < 100.0) {
			desired = desired.multiply(params.maxSpeed * (d / 100.0));
		} else {
			desired = desired.multiply(params.maxSpeed);
		}
		
		return desired.subtract(boid.velocity).clamp(params.maxForce);
	}
	
	return vector(0, 0);
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
		.attr('transform', function (boid) { return 'translate(' + boid.position.x() + ',' + boid.position.y() + ')'; });
		
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