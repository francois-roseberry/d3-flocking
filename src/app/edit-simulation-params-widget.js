(function() {
	"use strict";
	
	exports.render = function(container, params) {
		var _params = new Rx.BehaviorSubject(params);
		container.append('h3')
			.text('Controls');
		
		var weightsBox = container.append('div')
			.classed('box', true);
			
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
					change: onSliderChange(param.name)
				});
			});
			
		return {
			params: function () {
				return _params.asObservable();
			}
		};	
	};
	
	function onSliderChange (name) {
		return function (event, ui) {
			params.weights[name] = ui.value;
			_params.onNext(params);
		};
	}
}());