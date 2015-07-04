function controls(container) {
	controlsContainer.append('h3')
	.text('Controls');
	
	var weightsBox = controlsContainer.append('div')
		.classed('box', true)
		.append('span')
		.text('Weights');
		
	weigthsBox.append('span').text('Cohesion');
	weigthsBox.append('span').text('Alignment');
	weigthsBox.append('span').text('Separation');
}