(function() {
	"use strict";
	
	var precondition = require('./contract').precondition;
	
	exports.render = function(container, editSimulationParamsTask) {
		precondition(container, 'EditSimulationParamsWidget requires a container to render into');
		precondition(editSimulationParamsTask, 'EditSimulationParamsWidget requires an EditSimulationParamsTask');
		
		var controlsContainer = d3.select(container[0])
			.append('div')
			.classed({
				'simulation-controls': true,
				'controls-box': true
			});
		
		editSimulationParamsTask.params().take(1).subscribe(function (params) {
			renderParamControls(controlsContainer, editSimulationParamsTask, params);
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
				{ id: 'cohesion', name: 'Cohesion', value: params.weights.cohesion },
				{ id: 'alignment', name: 'Alignment', value: params.weights.alignment },
				{ id: 'separation', name: 'Separation', value: params.weights.separation }
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
			.attr('data-ui', function (param) {
				return 'slider-' + param.id;
			})
			.each(function (param) {
				$(this).slider({
					min: 1, max: 10, step: 0.5, value: param.value,
					change: onSliderChange(editSimulationParamsTask, param.id)
				});
			});
	}
	
	function onSliderChange (editSimulationParamsTask, name) {
		return function (event, ui) {
			editSimulationParamsTask.setWeight(name, ui.value);
		};
	}
}());