(function() {
	"use strict";
	
	var precondition = require('./contract').precondition;
	
	exports.actions = {
		start: function () {
			return {id: 'start', name: 'Start', fn: 'startSimulation'};
		},
		stop: function () {
			return {id: 'stop', name: 'Stop', fn: 'stopSimulation'};
		}
	};

	exports.start = function (params) {
		precondition(params, 'EditSimulationParamsTask requires the parameters of the simulation');
		
		return new EditSimulationParamsTask(params);
	};
	
	function EditSimulationParamsTask(params) {
		this._paramsSubject = new Rx.BehaviorSubject(params);
		this._active = new Rx.ReplaySubject(1);
		this._possibleActions = new Rx.BehaviorSubject([exports.actions.start()]);
	}
	
	EditSimulationParamsTask.prototype.params = function () {
		return this._paramsSubject.asObservable();
	};
	
	EditSimulationParamsTask.prototype.simulationActive = function () {
		return this._active.asObservable();
	};
	
	EditSimulationParamsTask.prototype.possibleActions = function () {
		return this._possibleActions.asObservable();
	};
	
	EditSimulationParamsTask.prototype.setWeight = function (name, value) {
		precondition(name, 'Setting a weight of an EditSimulationParamsTask requires the weight name');
		precondition(value, 'Setting a weight of an EditSimulationParamsTask requires the weight value');
		
		var self = this;
		this._paramsSubject.take(1).subscribe(function (params) {
			params.weights[name] = value;
			self._paramsSubject.onNext(params);
		});
	};
	
	EditSimulationParamsTask.prototype.startSimulation = function () {
		this._active.onNext(true);
		this._possibleActions.onNext([exports.actions.stop()]);
	};
	
	EditSimulationParamsTask.prototype.stopSimulation = function () {
		this._active.onNext(false);
		this._possibleActions.onNext([exports.actions.start()]);
	};
}());