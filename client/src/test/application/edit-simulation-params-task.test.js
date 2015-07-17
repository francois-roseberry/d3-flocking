(function() {
	"use strict";
	
	var expect = require('expect.js');
	
	var EditSimulationParamsTask = require('./edit-simulation-params-task');
	
	describe('The EditSimulationParamsTask', function () {
		var task;
		var params;
		
		beforeEach(function () {
			params = { weights: {}};
			task = EditSimulationParamsTask.start(params);
		});
		
		it('fire an event when one of its weights is set', function (done) {
			var NAME = 'weight1';
			var VALUE = 10;
			task.setWeight(NAME, VALUE);
			
			task.params().subscribe(function (params) {
				expect(params.weights[NAME]).to.eql(VALUE);
				done();
			});
		});
	});
}());