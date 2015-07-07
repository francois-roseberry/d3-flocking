function RunSimulationTask(params, size, container) {
	this._stopped = new Rx.AsyncSubject();
	var simulationModel = new SimulationModel(params, SIZE);
	new SimulationWidget(container, simulationModel, SIZE);
	
	var controlsContainer = container.append('div');
	var controls = renderControls(controlsContainer, params);

	Rx.Observable.timer(0, 20)
		.takeUntil(this._stopped)
		.withLatestFrom(controls.params(), function (time, params) { return params; })
		.subscribe(updateSample(simulationModel));
		
	function updateSample(model) {
		return function (params) {
			model.update(params);
		}
	}
}

RunSimulationTask.prototype.stop = function () {
	this._stopped.onNext();
	this._stopped.onCompleted();
};