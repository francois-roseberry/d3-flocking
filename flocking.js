var WIDTH = 600;
var HEIGHT = 400;
var NB_BOIDS = 400;

var boids = [];
for (var i = 0; i < NB_BOIDS; i++) {
	var boid = {
		x: Math.random() * WIDTH,
		y: Math.random() * HEIGHT
	};
	boids.push(boid);
}

d3.select('body')
	.append('svg')
	.classed('flocking-container', true)
	.attr('width', WIDTH)
	.attr('height', HEIGHT)
	.selectAll('circle')
	.data(boids)
	.enter()
	.append('circle')
	.attr('cx', function (boid) { return boid.x; })
	.attr('cy', function (boid) { return boid.y; })
	.attr('r', 1)
	.attr('fill', 'black');