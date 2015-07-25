(function() {
	"use strict";
	
	var SimulationWidget = require('./simulation-widget');
	var RunSimulationTask = require('./run-simulation-task');
	
	var PARAMS = require('./simulation-params').params();
	var describeInDom = require('./dom-fixture').describeInDom;
	
	describeInDom('A simulation widget', function (domContext) {
		var SIZE = {
			width: 600,
			height: 400
		};
	
		beforeEach(function () {
			var task = RunSimulationTask.start(PARAMS, SIZE);
			SimulationWidget.render(domContext.rootElement, task, SIZE);
		});
		
		it('is rendered in the given container', function() {
			domContext.assertOneOf('.flocking-box');
		});
	});
}());