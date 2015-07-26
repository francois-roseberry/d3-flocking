(function() {
	"use strict";
	
	var EditSimulationParamsWidget = require('./edit-simulation-params-widget');
	var EditSimulationParamsTask = require('./edit-simulation-params-task');
	
	var PARAMS = require('./simulation-params').params();
	var describeInDom = require('./dom-fixture').describeInDom;
	
	describeInDom('An EditSimulationParams widget', function (domContext) {
		beforeEach(function () {
			var task = EditSimulationParamsTask.start(PARAMS);
			EditSimulationParamsWidget.render(domContext.rootElement, task);
		});
		
		it('is rendered in the given container', function() {
			domContext.assertOneOf('.simulation-controls');
		});
	});
}());