# flocking-js [Completed]
Implementation of flocking particles with D3

To setup the project after downloading the sources, install node.js, 
then run 'npm install' both in the project directory in the client/ subdirectory.
After, the 'grunt' command should be available to build from that directory.

Run 'grunt background'. While it runs, open another terminal and run 'grunt check' to run tests and deploy.
Also, the server is running in the background, so it is accessible on http://localhost:3000.  It is also
possible to connect directly to the Karma server on http://localhost:9876

Note: grunt runs karma on windows using git bash, so it must be in the path. Logically, at this point Git
Bash should be installed, since you just pulled the sources from GitHub. But be sure to put Git Bash in the
path (installation option in 'Git for Windows' installer)

This setup is not tested on systems other than Windows Vista and 7 and therefore I don't know if this works on non-Windows systems.
