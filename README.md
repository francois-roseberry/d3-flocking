# flocking-js
Implementation of flocking particles with D3

Run 'grunt' on the command line in the client/ subdirectory to build the sources.
It will run them through jshint, flatten, link them with browserify, run tests with mocha and minify the output.
It will produce files in target/dist/. Run grunt clean to delete the target/. Run it with run.bat in the main directory. 

To setup the project after downloading the sources, install node.js, then run 'npm install' in the client/ subdirectory.
After, the 'grunt' command should be available to build from that directory.

Install Express (for the server) by running npm install from the project directory.

TODO : get a stacktrace for a js error and run tests with dependencies
