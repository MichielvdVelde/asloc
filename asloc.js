#! /usr/bin/env node

/**
 * asloc CLI
*/

var options = {
    'dir': __dirname,
    'recursive': false,
    'filter': false,
    'ignoreComments': true
};

// asloc
// Search the current directory with default options

// asloc somefolder
// Search the specified directory with default options

var program = require('commander');
var fs = require('fs');
var recursive = require('recursive-readdir');
var pkg = require('package');

/**
 * List all files in the directory, possibly based on the filter
**/
var listFilesInDirectory = function(callback) {

    var listFiles = function(cb) {
        //
    };
    var listFilesRecursive = function(cb) {
        //
    };

    var listFunc = (options.recursive) ? listFiles : listFilesRecursive;
    listFunc(function(err, files) {
        //
    });

};

/**
 * Function that actually loads the files and counts the SLOCs
*/
var countSLOC = function(callback) {

    //

};

program
    .version(pkg.version)
    .option('-r, --recurive', 'Enable recursive directory walking')
    .parse(process.argv);

if(program.args.length >= 1) options.dir = program.args[0];
