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
	
	var d3 = require('d3');
	var $ = require('jquery');

	var RunSimulationTask = require('./run-simulation-task');
	var SimulationWidget = require('./simulation-widget');
	
	var failFast = require('./fail-fast');

	var task = null;
	
	failFast.crashOnUnhandledException();
    failFast.crashOnResourceLoadingError();

	$(document).ready(startSample());

	$(window).unload(function () {
		task.stop();
	});

	function startSample() {
		var container = d3.select('.sample-container');

		container.append('h1')
			.text('Flocking sample');
			
		task = RunSimulationTask.start(PARAMS, SIZE, container);
		SimulationWidget.render(container, task, SIZE);
	}
}());

