"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
	jshint: {
		options: {
			jshintrc: "jshintrc"
		},

		all: {
			src: [
				'Gruntfile.js',
				'src/**/*.js',
			]
		}
	},
		
	copy: {
		flatten: {
			expand: true,
			src: ['src/**'],
			dest: 'target/stagger/',
			filter: 'isFile',
			flatten: true
		}
	},
		
	browserify: {
		dist: {
			files: {
				'./target/dist.js': ['target/stagger/bootstrap.js']
			}
		}
	}
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('default', ['jshint', 'copy:flatten', 'browserify']);
};