#! /usr/bin/env node

/**
 * asloc CLI
*/

var pkg = require('./package');
var program = require('commander');

var path = require('path');
var fs = require('fs');

/**
 * Various helper methods
*/
var helpers = {

  /**
   * Resolve and normalize the dir path gotten from the arguments
  **/
  'resolveAndNormalizePath': function(to) {
    return path.resolve(__dirname, to);
  },

  /**
   * Split the filter into an array of its elements
   * NOTE: Find a better way
  */
  'splitFilterList': function(val) {
    return val.split(/[ ,]+/).filter(Boolean);
  },

  /**
   * Check to see if a directory exists
  */
  'dirExists': function(dir) {
    try {
      fs.accessSync(dir);
    }
    catch(error) {
      return false;
    }
    return fs.statSync(dir).isDirectory();
  }

};

/**
 * Methods to walk through the directory structure
**/
var walk = {

  /**
   * Do a recursive walk
  **/
  'recurive': function(dir, callback) {
    var list = [];
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
      file = path.join(dir, file);
      if(fs.statSync(file).isDirectory()) {
        walk.recurive(file, function(err, newFiles) {
          list = list.concat(newFiles);
        });
      }
      else {
        list.push(file);
      }
    });
    return callback(null, list);
  },

  /**
   * Do a non-recursive walk
  **/
  'notrecursive': function(dir, callback) {
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
  }
};

/**
 * Count the SLOC and comments in a file source
**/
var countSourceSLOC = function(source, ignoreComments) {
  source = source.split("\n");

  var sourceInfo = {
    'sloc': 0,
    'comm': {
      'single': 0,
      'multi': 0,
      'total': 0
    },
    'empty': 0
  };

  var multilineCommentOpen = false;
  for(var l = 0; l < source.length; l++) {
    var curLine = source[l].trim();
    if(curLine.length === 0) {
      sourceInfo.empty++;
      continue;
    }
    if(curLine.substr(0, 2) == '//') {
      sourceInfo.comm.single++;
      sourceInfo.comm.total++;
      continue;
    }
    if(curLine.substr(0, 2) == '/*' && !multilineCommentOpen) {
      multilineCommentOpen = true;
      sourceInfo.comm.multi++;
      sourceInfo.comm.total++;
      continue;
    }
    if(curLine.substr(-2) == '*/' && multilineCommentOpen) {
      multilineCommentOpen = false;
      continue;
    }
    sourceInfo.sloc++;
  }
  return sourceInfo;
};

/**
 * Process all walked and retrieved files
**/
var processFiles = function(err, files) {
  var fileInfo = {};
  var totalInfo = {
    'sloc': 0,
    'comm': {
      'single': 0,
      'multi': 0,
      'total': 0
    }
  };
  if(err) return console.error(err);
  for(var i = 0; i < files.length; i++) {
    if(program.filter && program.filter.indexOf(path.extname(files[i]).substr(1)) == -1) continue;
    var source = fs.readFileSync(files[i], 'utf8');
    var sourceSLOC = countSourceSLOC(source, program.ignorecomments || false);
    fileInfo[files[i]] = sourceSLOC;
    totalInfo.sloc += sourceSLOC.sloc;
    totalInfo.comm.single += sourceSLOC.comm.single;
    totalInfo.comm.multi += sourceSLOC.comm.multi;
    totalInfo.comm.total += sourceSLOC.comm.total;
  }
  displayResults(totalInfo, fileInfo);
};

/**
 * Display the results
*/
var displayResults = function(totalInfo, fileInfo) {
  if(program.verbose) {
    console.log('SLOC count per file:');
    for(var file in fileInfo) {
      console.log();
      console.log(' File: %s', path.relative(__dirname, file));
      if(!program.ignoreComments) {
        console.log('  SLOC: %d', fileInfo[file].sloc.toLocaleString());
        console.log('  Comments: %s\n   Single line: %s\n   Multiline: %s', fileInfo[file].comm.total.toLocaleString(), fileInfo[file].comm.single.toLocaleString(), fileInfo[file].comm.multi.toLocaleString());
      }
      else {
        console.log('  SLOC: %d', (fileInfo[file].sloc + fileInfo[file].comm).toLocaleString());
      }
    }
  }
  console.log();
  console.log('Total SLOC count: %s', totalInfo.sloc.toLocaleString());
  if(!program.ignoreComments) console.log('Total comment line count: %s\n Single line: %s\n Multi line: %s', totalInfo.comm.total.toLocaleString(), totalInfo.comm.single.toLocaleString(), totalInfo.comm.multi.toLocaleString());
};


program
    .version(pkg.version)
    .description('Simple Single Lines Of Code (SLOC) counter tool')
    .option('-d, --dir <dir>', 'directory to walk (default is current directory)', helpers.resolveAndNormalizePath, __dirname)
    .option('-i, --ignorecomments', 'ignore comments in SLOC count')
    .option('-r, --recurive', 'enable recursive directory walking')
    .option('-f, --filter [filters]', 'filter by file type (e.g. \'js,css\')', helpers.splitFilterList)
    .option('-v, --verbose', 'show verbose output')
    .parse(process.argv);

/**
 * First make sure we selected a valid directory
*/
if(!helpers.dirExists(program.dir)) {
  return console.error('Error: Specified directory is not a directory or doesn\'t exist!');
}

/**
 * Finally select the appropriate action based on the -r option
**/
if(!program.recurive) walk.notrecursive(program.dir, processFiles);
else walk.recursive(program.dir, processFiles);
