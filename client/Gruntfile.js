"use strict";

module.exports = function(grunt) {
  grunt.initConfig({
	jshint: {
		options: {
			jshintrc: "build/jshintrc"
		},
		all: {
			src: [
				'Gruntfile.js',
				'src/**/*.js'
			]
		}
	},
	
	csslint: {
		options: {
			csslintrc: 'build/csslintrc'
		},
		all: {
			src: ['src/**/*.css']
		}
	},
		
	copy: {
		flatten: {
			expand: true,
			src: ['src/**/*.js'],
			dest: 'target/stagger/',
			filter: 'isFile',
			flatten: true
		},
		
		html: {
			src: ['src/static/index.html'],
			dest: 'target/dist/index.html',
			filter: 'isFile'
		},
		
		style: {
			src: ['lib/jquery-ui.min.css'],
			dest: 'target/dist/',
			filter: 'isFile'
		}
	},
		
	browserify: {
		dist: {
			files: {
				'./target/dist/app.js': ['target/stagger/bootstrap.js']
			}
		}
	},
	
	concat: {
		dependencies: {
			src: [
				'lib/jquery.js',
				'lib/jquery-ui.min.js',
				'lib/rx.all.min.js',
				'lib/underscore.min.js',
				'lib/d3.min.js',
				'node_modules/expect.js/index.js'
			],
			dest: './target/dist/dependencies.js'
		}
	},
	
	mochaTest: {
		test: {
			options: {
				reporter: 'list'
			},

			src: ['target/stagger/*.test.js']
		}
    },
	
	uglify: {
		target: {
			files: {
				'target/dist/app.min.js': ['target/dist/app.js']
			}
		}
	},
	
	cssmin: {
		target: {
			files: {
				'target/dist/styles.min.css': ['src/**/*.css']
			}
		}
	},
	
	clean: ['target/**']
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('minify', ['cssmin']);
  grunt.registerTask('package', ['copy', 'browserify', 'concat', 'minify']);
  
  grunt.registerTask('default', ['lint', 'package', 'mochaTest']);
};