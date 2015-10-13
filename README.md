
# asloc

**Note:** This project, while usable, is currently a Work-In-Progress!

asloc is a very simple CLI tool for counting Single Lines Of Code (SLOC). The aim of the tool is to be as easy to use as possible, with the features you most want.

## Features

asloc currently has the following features:

* Filter by file extension type
* Display per-file SLOC count and/or total count
* Also displays the amount of comment lines
* Supports recursive walking, so files in subdirectories can be listed as well
* Count the SLOC and comment lines in all files in the given directory
* Ignores empty lines by default

### Missing

The following features will be added in a future version:

* Provide a prettier output
* Future talk: optionally parse .gitignore files to exclude files/dirs listed

## Install

```
npm install -g asloc
```

## Usage

```
$ asloc
```

### Options

* -d, --dir: directory to walk (defaults to the current directory)
* -i, --ignorecomments: ignore comments when calculating SLOC count
* -r, --recursive: do a recursive directory walk and list files in subdirs as well
* -f, --filter: comma-delimited list of file types to count (e.g. `js,css`)
* -v, --verbose: enable verbose, per-file SLOC count display
* -h, --help: display help

### Example usage

```
$ asloc -v
```

```
SLOC count per file:

 Files: myfirstfile.js
  SLOC: 23
  Comment lines: 6

 File: mysecondfile.js
  SLOC: 68
  Comment lines: 0

 File: mythirdfile.css
  SLOC: 18
  Comment lines: 1

Total SLOC count: 109
Total comment line count: 7
```

## Changelog

* 0.0.5 0.0.8 - 13 Oct 2015
  * Fixed a few typos - oops (today is not my day)
  * Added `asloc.js` to the `bin` field in `package.json` (should now be executable)
* V0.0.1 - v0.0.4 - 12 Oct. 2015
  * Display amount of comment lines
  * Significant code cleanup
  * Added `verbose` option
  * Added `filter` option
  * Now supports recursive directory walking
  * Initial publish

## License

Copyright 2015 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
