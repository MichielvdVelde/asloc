#! /usr/bin/env node

/**
 * asloc CLI
*/

var pkg = require('./package');
var program = require('commander');

var path = require('path');
var fs = require('fs');

// Split the filter list
var splitFilterList = function(val) {
  return val.split(/\s*,\s*/);
};

var resolveAndNormalizePath = function(to) {
  return path.resolve(__dirname, to);
};

var dirExists = function(dir) {
  try {
    fs.accessSync(dir);
  }
  catch(error) {
    return false;
  }
  fs.statSync(dir).isDirectory();
};

var walkRecursive = function(dir, callback) {
  // TODO
};

var walkNotRecursive = function(dir, callback) {
  fs.readdir(dir, function(err, files) {
    if(err) return callback(err);
    var newFiles = [];
    for(var i in files) {
      files[i] = path.resolve(dir, files[i]);
      var stat = fs.statSync(files[i]);
      if(stat.isDirectory()) continue;
      newFiles.push(files[i]);
    }
    return callback(null, newFiles);
  });
};


var countSourceSLOC = function(source, ignoreComments) {
  source = source.split("\n");
  var sloc = 0;
  for(var n = 0; n < source.length; n++) {
    var multilineCommentOpen = false;
    source[n] = source[n].trim();
    // Don't count enpty lines
    if(source[n].length === 0) continue;
    // Remove single-line comments
    if(ignoreComments && source[n].substr(0, 2) == '//') continue;
    // Remove multi-line comments
    if(ignoreComments && source[n].substr(0, 2) == '/*' && !multilineCommentOpen) multilineCommentOpen = true;
    if(ignoreComments && source[n].substr(-2) == '*/' && multilineCommentOpen) multilineCommentOpen = false;
    if(multilineCommentOpen) continue;
    // Finally count the line
    sloc++;
  }
  return sloc;
};

var displayResults = function(totalSLOCs, fileSLOCs) {
  console.log('SLOC count per file:');
  for(var key in fileSLOCs) {
    console.log();
    console.log(' File: %s', path.relative(__dirname, key));
    console.log(' SLOC: %d', fileSLOCs[key]);
  }
  console.log();
  console.log('Total SLOC count: %d', totalSLOCs);
};


program
    .version(pkg.version)
    .description('Simple Single Lines Of Code (SLOC) counter tool')
    .option('-d, --dir <dir>', 'Directory to walk (default is current directory)', resolveAndNormalizePath, __dirname)
    .option('-i, --ignorecomments', 'Ignore comments in SLOC count')
    // TODO: Implement recursive directory walking
    //.option('-r, --recurive', 'Enable recursive directory walking')
    // TODO: Implement filter
    //.option('-f, --filter [filters]', 'Filter by file or type', splitFilterList)
    .parse(process.argv);

// First make sure we selected a valid directory
if(!dirExists(program.dir)) {
  return console.error('Error: Specified directory is not a directory or doesn\'t exist!');
}

var fileSLOC = {};
var totalSLOC = 0;

walkNotRecursive(program.dir, function(err, files) {
  if(err) {

    if(err.message.indexOf('ENOENT') != -1) return console.error('Error: specified directory doesn\'t exist!');
    return console.error(err);
  }
  var totalSLOC = 0;
  for(var i = 0; i < files.length; i++) {
    var source = fs.readFileSync(files[i], 'utf8');
    fileSLOC[files[i]] = countSourceSLOC(source, program.ignorecomments || false);
    totalSLOC += fileSLOC[files[i]];
  }
  // Now we can display it!
  displayResults(totalSLOC, fileSLOC);
});
