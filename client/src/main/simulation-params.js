(function() {
	"use strict";
	
	exports.params = function () {
		return {
			nbBoids: 100,
			neighboorRadius: 30,
			desiredSeparation: 5,
			maxSpeed: 2,
			maxForce: 4,
			weights: {
				cohesion: 1,
				alignment: 1,
				separation: 4
			}
		};
	};
}());
