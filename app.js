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

var stopped = false;

$(document).ready(startSample(PARAMS));

$(window).unload(function () {
	stopped = true;
})

function startSample(params) {
	var container = d3.select('body')
		.append('div')
		.classed('sample-container', true);

	container.append('h1')
		.text('Flocking sample with D3');
		
	var simulationModel = new SimulationModel(params, SIZE);
	new SimulationWidget(container, simulationModel, SIZE);
		
	var controlsContainer = container.append('div');
	var controls = renderControls(controlsContainer, params);

	Rx.Observable.timer(0, 20)
		.filter(function () { return !stopped; })
		.withLatestFrom(controls.params(), function (time, params) { return params; })
		.subscribe(updateSample(simulationModel));
}

function updateSample(model) {
	return function (params) {
		model.update(params);
	}
}

