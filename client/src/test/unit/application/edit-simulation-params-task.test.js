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
		
		it('fires an event at start with the possible actions', function (done) {
			task.possibleActions().subscribe(function (actions) {
				expect(actions).to.eql([{name: 'Start', fn: 'startSimulation'}]);
				done();
			});
		});
		
		it('fires an event at start with the initial params', function (done) {
			task.params().subscribe(function (params) {
				expect(params).to.eql(PARAMS);
				done();
			});
		});
		
		it('fires an event when one of its weights is set', function (done) {
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
		
		it('fires an event when simulation is started', function (done) {
			task.startSimulation();
			
			task.simulationActive().subscribe(function (active) {
				expect(active).to.eql(true);
				done();
			});
		});
		
		it('fires an event about the possible actions after simulation is started', function (done) {
			task.startSimulation();
			
			task.possibleActions().subscribe(function (actions) {
				expect(actions).to.eql([{name: 'Stop', fn: 'stopSimulation'}]);
				done();
			});
		});
	});
}());