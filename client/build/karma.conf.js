// Karma configuration
"use strict";

var karmaCommon = require('./karma-common');

module.exports = function (config) {
    config.set(karmaCommon.withDefault(config, {

        // web server port
        port: 9876,

        // list of files to exclude
        exclude: [
            './target/stagger/src/*.slowTest.js',
            './target/stagger/src/bootstrap.js'
        ],

        //Will report any test slower than
        reportSlowerThan: 200,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    }));
};
