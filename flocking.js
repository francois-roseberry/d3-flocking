var WIDTH = 600;
var HEIGHT = 400;
var NB_BOIDS = 600;

var boids = [];
for (var i = 0; i < NB_BOIDS; i++) {
	var boid = {
		x: Math.random() * WIDTH,
		y: Math.random() * HEIGHT
	};
	boids.push(boid);
}

var container = d3.select('body')
	.append('div')
	.classed('sample-container', true);

container.append('h1')
	.text('Flocking sample with D3');

var svgContainer = container.append('svg')
	.classed('flocking-container', true)
	.attr('width', WIDTH)
	.attr('height', HEIGHT);
	
setInterval(updateSample(svgContainer), 10);

function updateSample(svgContainer) {
	return function () {
		updateBoids();
		renderBoids(svgContainer);
	}
}

function updateBoids() {
	_.each(boids, function (boid) {
		boid.y += 1;
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
		.attr({ 'cx': function (boid) { return boid.x; },
			    'cy': function (boid) { return boid.y; }
		});
		
}