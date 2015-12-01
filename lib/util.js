
var fs = require('fs');
var path = require('path');

var recursive = require('recursive-readdir');
var gitignore = require('parse-gitignore');

/**
 *
*/
exports.getFilesNotRecursive = module.exports.getFilesNotRecursive = function(dir, options, callback) {

	fs.readdir(dir, function(error, files) {
		if(error) {
			return callback(error);
		}
		var fileName;
		var fileList = [];
		for(var i = 0; i < files.length; i++) {
			fileName = path.resolve(dir, files[i]);
			// TODO: Check if the file needs to be ignored
			var stat = fs.statSync(fileName);
			if(stat.isFile()) fileList.push(fileName);
		}
		return callback(null, fileList);
	});

};

/**
 *
*/
exports.getFilesRecursive = module.exports.getFilesRecursive = function(dir, options, callback) {

	recursive(dir, options.gitignore, function(error, list) {
		if(error) {
			return callback(error);
		}
		return callback(null, list);
	});

};
