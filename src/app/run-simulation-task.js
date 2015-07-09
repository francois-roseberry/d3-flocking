(function() {
	"use strict";
	
	var SimulationModel = require('./simulation-model');
	var SimulationWidget = require('./simulation-widget');
	var EditSimulationParamsWidget = require('./edit-simulation-params-widget');

	exports.start = function(params, size, container) {
		return new RunSimulationTask(params, size, container);
	};

	function RunSimulationTask(params, size, container) {
		this._stopped = new Rx.AsyncSubject();
		var simulationModel = SimulationModel.newModel(params, size);
		SimulationWidget.render(container, simulationModel, size);
		
		var controlsContainer = container.append('div');
		var controls = EditSimulationParamsWidget.render(controlsContainer, params);

		Rx.Observable.timer(0, 20)
			.takeUntil(this._stopped)
			.withLatestFrom(controls.params(), function (time, params) { return params; })
			.subscribe(updateSample(simulationModel));
	}
	
	function updateSample(model) {
		return function (params) {
			model.update(params);
		}
	}

	RunSimulationTask.prototype.stop = function () {
		this._stopped.onNext();
		this._stopped.onCompleted();
	};
}());