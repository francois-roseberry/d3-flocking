'use strict';

exports.withDefault = function (karma, specificConfiguration) {
    var _ = require('underscore');

    return _.defaults(specificConfiguration, {
        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // frameworks to use
        frameworks: ['mocha', 'commonjs'],

        preprocessors: {
            // Commonjs preprocessor allow the tests to use the modules system of browserify
            'target/stagger/**/*.js': ['commonjs']
        },

        // list of files / patterns to load in the browser
        // The order is important!
        files: [
            'node_modules/expect.js/index.js',
			'target/dist/lib/dependencies.js',
            {pattern: 'target/dist/index.html', watched: false},
            {pattern: 'target/dist/images/*', included: false, served: true},
			'target/stagger/src/**/*.js'
        ],  

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['dots'],

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values:
        // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: karma.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Time to wait before a browser is considered disconnected
        browserDisconnectTimeout : 10000, // default 2000
        // Fix the disconnected error on PhantomJS 1.9.7
        browserDisconnectTolerance : 1, // default 0
        browserNoActivityTimeout : 60000, //default 10000
    });
};