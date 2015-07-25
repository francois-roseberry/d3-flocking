(function() {
	"use strict";

	var SIZE = {
		width: 600,
		height: 400
	};

	var SimulationParams = require('./simulation-params');
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
		var container = $('.sample-container');

		d3.select(container[0]).append('h1')
			.text('Flocking sample');
			
		task = RunSimulationTask.start(SimulationParams.params(), SIZE);
		SimulationWidget.render(container, task, SIZE);
	}
}());

