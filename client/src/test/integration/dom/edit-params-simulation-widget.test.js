(function() {
	"use strict";
	
	var EditSimulationParamsWidget = require('./edit-simulation-params-widget');
	var EditSimulationParamsTask = require('./edit-simulation-params-task');
	
	var PARAMS = require('./simulation-params').params();
	var describeInDom = require('./dom-fixture').describeInDom;
	
	describeInDom('An EditSimulationParams widget', function (domContext) {
		var task;
		
		beforeEach(function () {
			task = EditSimulationParamsTask.start(PARAMS);
			EditSimulationParamsWidget.render(domContext.rootElement, task);
		});
		
		it('is rendered in the given container', function() {
			domContext.assertOneOf('.simulation-controls');
		});
		
		it('the slider values correspond to the weights', function () {
			var cohesion = $('[data-ui=slider-cohesion]').slider('option', 'value');
			expect(cohesion).to.eql(PARAMS.weights.cohesion);
			
			var alignment = $('[data-ui=slider-alignment]').slider('option', 'value');
			expect(alignment).to.eql(PARAMS.weights.alignment);
			
			var separation = $('[data-ui=slider-separation]').slider('option', 'value');
			expect(separation).to.eql(PARAMS.weights.separation);
		});
		
		it('setting cohesion weight value fires ' +
			'an event with the updated params in the underlying task', function (done) {
			var COHESION = 4;
			$('[data-ui=slider-cohesion]').slider('option', 'value', COHESION);
			
			task.params().subscribe(function (params) {
				expect(params.weights.cohesion).to.eql(COHESION);
				done();
			});
		});
		
		it('setting alignment weight value fires ' +
			'an event with the updated params in the underlying task', function (done) {
			var ALIGNMENT = 4;
			$('[data-ui=slider-alignment]').slider('option', 'value', ALIGNMENT);
			
			task.params().subscribe(function (params) {
				expect(params.weights.alignment).to.eql(ALIGNMENT);
				done();
			});
		});
		
		it('setting separation weight value fires ' +
			'an event with the updated params in the underlying task', function (done) {
			var SEPARATION = 4;
			$('[data-ui=slider-separation]').slider('option', 'value', SEPARATION);
			
			task.params().subscribe(function (params) {
				expect(params.weights.separation).to.eql(SEPARATION);
				done();
			});
		});
		
		it('at start, start-stop button has the possible action name as text', function (done) {
			task.possibleActions().take(1).subscribe(function (actions) {
				domContext.assertText('[data-ui=btn-start-stop]', actions[0].name);
				done();
			});
		});
		
		it('after clicking on it, start-stop button has the possible action name as text', function (done) {
			task.possibleActions().skip(1).take(1).subscribe(function (actions) {
				domContext.assertText('[data-ui=btn-start-stop]', actions[0].name);
				domContext.assertOneOf('.simulation-flow-button');
				done();
			});
			
			domContext.clickOn('[data-ui=btn-start-stop]');
		});
		
		it('clicking on the button to start the simulation fires an event in the underlying task',
			function (done) {
			task.simulationActive().subscribe(function (active) {
				expect(active).to.be(true);
				done();
			});
			
			domContext.clickOn('[data-ui=btn-start-stop]');
		});
	});
}());