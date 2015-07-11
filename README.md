# flocking-js
Implementation of flocking particles with D3

Run 'grunt' on the command line in the project directory to build the sources.
It will run them through jshint, flatten, link them with browserify, run tests with mocha and minify the output.
It will produce a final file target/dist.js that will be included in the file index.html,
entry point of the app. Simply run it in the browser [Only tested in Chrome though].

To setup the project after downloading the sources, install node.js, then run 'npm install'
in the project directory. That's it. After, the 'grunt' command should be available

TODO : expand the tests, try to run them in the original files (to avoid getting a stack trace in the dist file), add preconditions, concatenate and lint the CSS
