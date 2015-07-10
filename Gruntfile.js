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
	},
	
	concat: {
		dependencies: {
			src: [
				'lib/jquery.js',
				'lib/jquery-ui.min.js',
				'lib/rx.all.min.js',
				'node_modules/expect.js/index.js'
			],
			dest: './target/dependencies.js'
		}
	},
	
	mochaTest: {
		test: {
			options: {
				reporter: 'list'
			},

			src: ['target/stagger/*.test.js']
		}
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  grunt.registerTask('default', ['jshint', 'copy:flatten', 'browserify', 'concat', 'mochaTest']);
};