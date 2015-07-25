(function() {
	"use strict";
	
	var SimulationParams = require('./simulation-params');
	var EditSimulationParamsTask = require('./edit-simulation-params-task');
	
	describe('The EditSimulationParamsTask', function () {
		var task;
		var PARAMS;
		
		beforeEach(function () {
			PARAMS = SimulationParams.params();
			task = EditSimulationParamsTask.start(PARAMS);
		});
		
		it('fire an event at start with the initial params', function (done) {
			task.params().subscribe(function (params) {
				expect(params).to.eql(PARAMS);
				done();
			});
		});
		
		it('fire an event when one of its weights is set', function (done) {
			var NAME = 'weight1';
			var VALUE = 10;
			var expectedParams = SimulationParams.params();
			expectedParams.weights[NAME] = VALUE;
				
			task.setWeight(NAME, VALUE);
			
			task.params().subscribe(function (params) {
				expect(params).to.eql(expectedParams);
				done();
			});
		});
	});
}());