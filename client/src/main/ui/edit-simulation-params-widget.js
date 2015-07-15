(function() {
	"use strict";
	
	var $ = require('jquery');
	require('jquery-ui');
	
	var precondition = require('./contract').precondition;
	
	exports.render = function(container, editSimulationParamsTask) {
		precondition(container, 'EditSimulationParamsWidget requires a container to render into');
		precondition(editSimulationParamsTask, 'EditSimulationParamsWidget requires an EditSimulationParamsTask');
		
		container.classed({
					'simulation-controls': true,
					'controls-box': true
					});
		
		editSimulationParamsTask.params().take(1).subscribe(function (params) {
			renderParamControls(container, editSimulationParamsTask, params);
		});
	};
	
	function renderParamControls(container, editSimulationParamsTask, params) {
		var weightsBox = container.append('div')
		.classed('controls-box', true);
			
		weightsBox.append('span').text('Weights');
		
		var controls = weightsBox.append('table')
			.attr({
				'align': 'center',
				'cellspacing': 20
			})
			.selectAll('tr')
			.data([
				{ name: 'Cohesion', value: params.weights.cohesion },
				{ name: 'Alignment', value: params.weights.alignment },
				{ name: 'Separation', value: params.weights.separation }
			])
			.enter()
			.append('tr');
			
		controls
			.append('td')
			.attr('align', 'left')
			.text(function (param) { return param.name; });
			
		controls
			.append('td')
			.attr('width', 300)
			.append('div')
			.each(function (param) {
				$(this).slider({
					min: 1, max: 10, step: 0.5, value: param.value,
					change: onSliderChange(editSimulationParamsTask, param.name)
				});
			});
	}
	
	function onSliderChange (editSimulationParamsTask, name) {
		return function (event, ui) {
			editSimulationParamsTask.setWeight(name, ui.value);
		};
	}
}());