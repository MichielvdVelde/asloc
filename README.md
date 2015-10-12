
# asloc

**Note:** This project, while usable, is currently a Work-In-Progress!

asloc is a very simple CLI tool for counting Single Lines Of Code (SLOC). The aim of the tool is to be as easy to use as possible, with the features you most want.

## Features

asloc currently has the following features:

* Filter by file extension type
* Display total SLOC count or per-file count
* Now supports recursive walking, so files in subdirectories can be listed as well
* Count the SLOC in all files in the given directory
* Ignores empty lines by default
* Ignore comments (both singe-line and multi-line) when processing SLOC count

### Missing

The following features will be added in a future version:

* Provide a prettier output
* Display amount of comment lines
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

 File: mysecondfile.js
 SLOC: 68

 File: mythirdfile.css
 SLOC: 18

Total SLOC count: 109
```

## Changelog

* Version 0.0.3 - 12 Oct. 2015
  * Added `verbose` option
  * Added `filter` option
* Version 0.0.2 - 12 Oct. 2015
  * Now supports recursive directory walking
* Version 0.0.1 - 12 Oct. 2015
  * Initial publish

## License

Copyright 2015 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
