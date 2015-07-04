function renderControls(container, weights) {
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
			{ name: 'Cohesion', value: weights.cohesion },
			{ name: 'Alignment', value: weights.alignment },
			{ name: 'Separation', value: weights.separation }
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
				min: 1, max: 10, step: 0.5, value: param.value
			});
		});
}