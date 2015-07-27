(function() {
	"use strict";
	
	var SimulationParams = require('./simulation-params');
	var RunSimulationTask = require('./run-simulation-task');
	
	describe('The RunSimulationTask', function () {
		var SIZE = {
			width: 600,
			height: 400
		};
		
		var task;
		var model;
		
		beforeEach(function () {
			var PARAMS = SimulationParams.params();
			task = RunSimulationTask.start(PARAMS, SIZE);
			model = task.model();
		});
		
		it('does not run at task creation', function () {
			model.boids().skip(1).subscribe(function () {
				throw new Error('Model should never be updated at this time');
			});
		});
		
		it('starts running when its EditSimulationTask fires an event', function (done) {
			task.editSimulationParamsTask().startSimulation();
			
			model.boids().skip(1).subscribe(function () {
				done();
			});
		});
		
		it('stops running if task is stopped', function () {
			task.stop();
			
			model.boids().skip(1).subscribe(function () {
				throw new Error('Model should never be updated at this time');
			});
		});
		
		it('stops running when its EditSimulationTask fires an event', function () {
			task.editSimulationParamsTask().startSimulation();
			task.editSimulationParamsTask().stopSimulation();
			
			model.boids().skip(1).subscribe(function () {
				throw new Error('Model should never be updated at this time');
			});
		});
	});
}());