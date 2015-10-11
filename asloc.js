#! /usr/bin/env node

/**
 * asloc CLI
*/

var options = {
    'dir': __dirname,
    'recursive': true,
    'filter': false,
    'ignoreComments': true
};

// asloc
// Search the current directory with default options

// asloc somefolder
// Search the specified directory with default options

var program = require('commander');
var recursive = require('recursive-readdir');
var pkg = require('package');

/**
 * Function that actually loads the files and counts the SLOCs
*/
var countSLOC = function() {

    var files = recursive(option.dir, function(err, files) {

        //

    });

};

program
    .version(pkg.version)
    .option('-r, --recurive', 'Disable recursive listing')
    .parse(process.argv);

if(program.args.length >= 1) options.dir = program.args[0];
