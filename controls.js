function renderControls(container) {
	container.append('h3')
		.text('Controls');
	
	var weightsBox = container.append('div')
		.classed('box', true)
		.append('span')
		.text('Weights');
		
	weightsBox.append('div').append('span').text('Cohesion');
	weightsBox.append('div').append('span').text('Alignment');
	weightsBox.append('div').append('span').text('Separation');
}