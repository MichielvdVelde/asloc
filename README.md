
# asloc

**Note:** This project, while usable, is currently a Work-In-Progress!

asloc is a very simple CLI tool for counting Single Lines Of Code (SLOC). The aim of the tool is to be as easy to use as possible, with the features you most want.

## Features

asloc currently has the following features:

* Count the SLOC in all files in the given directory
* Ignore comments (both singe-line and multi-line) when processing SLOC count

### Missing

The following features will be added in a future version:

* Recursive walk all subdirectories and process those files as well
* Filter which files to count based on its extension (e.g. only .js files)

## Install

```
npm install -g asloc
```

## Usage

Simply use the tool in your command prompt:

```
$ asloc
```

### Options

* -d, --dir: directory to walk (defaults to the current directory)
* -i, --ignorecomments: Ignore comments when calculating SLOC count

```
$ asloc -d myDir -i
```

## Changelog

* Version 0.0.1 - 12 Oct. 2015
  * Initial publish

## License

Copyright 2015 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
