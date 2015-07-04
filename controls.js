function renderControls(container, weights) {
	container.append('h3')
		.text('Controls');
	
	var weightsBox = container.append('div')
		.classed('box', true);
		
	weightsBox.append('span').text('Weights');
		
	var controls = weightsBox.selectAll('div')
		.data([{ name: 'Cohesion'}, { name: 'Alignment' }, { name: 'Separation' }])
		.enter()
		.append('div');
		
	controls
		.append('span')
		.text(function (param) { return param.name; });
		
	controls
		.append('div')
		.each(function (param) { $(this).slider(); });
}