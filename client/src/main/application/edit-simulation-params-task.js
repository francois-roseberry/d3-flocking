(function() {
	"use strict";
	
	var precondition = require('./contract').precondition;

	exports.start = function (params) {
		precondition(params, 'EditSimulationParamsTask requires the parameters of the simulation');
		
		return new EditSimulationParamsTask(params);
	};
	
	function EditSimulationParamsTask(params) {
		this._params = params;
		this._paramsSubject= new Rx.BehaviorSubject(params);
	}
	
	EditSimulationParamsTask.prototype.params = function () {
		return this._paramsSubject.asObservable();
	};
	
	EditSimulationParamsTask.prototype.setWeight = function (name, value) {
		precondition(name, 'Setting a weight of an EditSimulationParamsTask requires the weight name');
		precondition(value, 'Setting a weight of an EditSimulationParamsTask requires the weight value');
		
		this._params.weights[name] = value;
		this._paramsSubject.onNext(this._params);
	};
}());