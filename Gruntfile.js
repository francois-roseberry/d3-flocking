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
    },
	
	uglify: {
		target: {
			files: {
				'target/dist.min.js': ['target/dist.js']
			}
		}
	},
	
	cssmin: {
		target: {
			files: {
				'target/dist.min.css': ['src/**/*.css']
			}
		}
	}
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('minify', ['uglify', 'cssmin']);
  
  grunt.registerTask('default', ['lint', 'copy:flatten', 'browserify', 'concat', 'mochaTest', 'minify']);
};