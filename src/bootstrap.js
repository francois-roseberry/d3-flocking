(function() {
	"use strict";

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

	var RunSimulationTask = require('./app/run-simulation-task');
	var SimulationWidget = require('./app/simulation-widget');

	var task = null;

	$(document).ready(startSample());

	$(window).unload(function () {
		task.stop();
	})

	function startSample() {
		var container = d3.select('body')
			.append('div')
			.classed('sample-container', true);

		container.append('h1')
			.text('Flocking sample');
			
		task = RunSimulationTask.start(PARAMS, SIZE, container);
		SimulationWidget.render(container, task, SIZE);
	}
}());

