#! /usr/bin/env node

var pkg = require('../package');
var util = require('../lib/util');

var program = require('commander');
var gitignore = require('parse-gitignore');

var slocCounter = require('sloc-count');

var fs = require('fs');
var path = require('path');

/**
 *
*/
var displayResults = function(statsTotal, statsFile) {
	console.log();
	console.log(' Totals');
	console.log('  Total lines:', statsTotal.total);
	console.log('  Source lines:', statsTotal.total);
	console.log('  Single-line comments:', statsTotal.singleLineComments);
	console.log('  Block comments:', statsTotal.blockComments);
};

/**
 *
*/
var displayError = function(error) {
	console.error();
	console.error('Error:' + error.message || error);
};

/**
 *
*/
program
	.version(pkg.version)
	.description('Simple Single Lines Of Code (SLOC) counter tool')
	.arguments('<dir>')
	.option('-r, --recursive', 'Use recursive directory walking')
	.option('-g, --gitignore', 'Use .gitignore if available')
	.parse(process.argv);

// Resolve and normalize the path to use
program.dir = path.resolve(process.cwd(), program.args[0] || '.');
// Determine which method to use based on the recursive option
var getFiles = (program.recursive) ? util.getFilesRecursive : util.getFilesNotRecursive;

// Make an array with all options
var options = {
	'recursive': program.recursive || false,
	'gitignore': (program.gitignore) ? gitignore('.gitignore') : []
};

/**
 *
*/
getFiles(program.dir, options, function(error, files) {

	if(error || files.length === 0) {
		return displayError(error || 'No files found');
	}

	var statsTotal = {
		'total': 0,
		'source': 0,
		'singleLineComments': 0,
		'blockComments': 0,
		'empty': 0
	};
	var fileStats = {};
	for(var i = 0; i < files.length; i++) {

		var fileContents = fs.readFileSync(files[i], 'utf-8');
		var stats = slocCounter(fileContents);

		// Add to total
		statsTotal.total += stats.total;
		statsTotal.source += stats.source;
		statsTotal.singleLineComments += stats.singleLineComments;
		statsTotal.blockComments += stats.blockComments;
		statsTotal.empty += stats.empty;

		fileStats[files[i]] = stats;
	}
	return displayResults(statsTotal, fileStats);

});
