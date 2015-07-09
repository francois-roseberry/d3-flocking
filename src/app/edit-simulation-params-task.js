(function() {
	"use strict";
	
	exports.start = function(params) {
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
		this._params.weights[name] = value;
		this._paramsSubject.onNext(this._params);
	};
}());