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
		
		jqueryUiImages: {
			expand: true,
			cwd: 'node_modules/jquery-ui/themes/vader/images/',
			src: ['**'],
			dest: 'target/dist/images/',
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
	
	mochaTest: {
		test: {
			options: {
				reporter: 'list'
			},

			src: ['target/stagger/*.test.js']
		}
    },
	
	cssmin: {
		target: {
			files: {
				'target/dist/styles.min.css': [
												'src/**/*.css',
												'node_modules/jquery-ui/themes/vader/jquery-ui.min.css'
											]
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
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('minify', ['cssmin']);
  grunt.registerTask('package', ['copy', 'browserify', 'minify']);
  
  grunt.registerTask('default', ['lint', 'package', 'mochaTest']);
};