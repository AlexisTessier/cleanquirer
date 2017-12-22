# Cleanquirer

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

![Branch : master](https://img.shields.io/badge/Branch-master-blue.svg)
[![version](https://img.shields.io/badge/version-0.1.1-blue.svg)](https://github.com/AlexisTessier/cleanquirer#readme)
[![npm version](https://badge.fury.io/js/cleanquirer.svg)](https://badge.fury.io/js/cleanquirer)

[![Build Status](https://travis-ci.org/AlexisTessier/cleanquirer.svg?branch=master)](https://travis-ci.org/AlexisTessier/cleanquirer)
[![Coverage Status](https://coveralls.io/repos/AlexisTessier/cleanquirer/badge.svg?branch=master&service=github)](https://coveralls.io/github/AlexisTessier/cleanquirer?branch=master)

[![Dependency Status](https://david-dm.org/AlexisTessier/cleanquirer.svg)](https://david-dm.org/AlexisTessier/cleanquirer)
[![devDependency Status](https://david-dm.org/AlexisTessier/cleanquirer/dev-status.svg)](https://david-dm.org/AlexisTessier/cleanquirer#info=devDependencies)

Create a cli tool from a documented javascript API 💻

-   [Introduction](#introduction)
-   [Get started](#get-started)
-   [Documentation](#documentation)
-   [License](#license)

## Introduction

This module provides a way to easily generate node CLI modules, eventually using files documented with [documentation.js](http://documentation.js.org/).

## Get started

### Create and use a simple CLI

First, implement one or more commands with documentation using the following pattern (one file for each command):

```javascript
// path/to/command/file.js

/**
 * @name my-cli-command
 */
function cliCommand({
    option,
    option2 = 'default-value'
} = {}){
    // do some asynchronous stuffs
}

module.exports = cliCommand
```

Now, you have to create a cli function using cleanquirer:

```javascript
// path/to/cli-function.js

const path = require('path');

const cleanquirer = require('cleanquirer');

module.exports = cleanquirer({
    name: 'cli-name',
    commands: [
        path.join(__dirname, 'path/to/command/file.js'),
        path.join(__dirname, 'path/to/other/command/file.js'),
        path.join(__dirname, 'glob/matching/multiple/commands/file/*.js')
    ]
})
```

You can use the exported function to call methods of the cli api directly in javascript

```javascript
// path/to/a/file.js

const myCli = require('path/to/cli-function.js');

myCli(['my-cli-command']).then(()=>{
    // do stuffs after the command was executed
})
```

Then you just have to create a bin file which will do the link between myCli and the terminal input

```javascript
path/to/bin/myCli
#!/usr/bin/env node

'use strict';

require('path/to/cli-function.js')(process.argv.slice(2));
```

And fill the bin field in your module package.json

    // package.json
    "bin": {
      "cli-name": "path/to/bin/myCli"
    }

## Documentation

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [cleanquirer](#cleanquirer)

### cleanquirer

Create a cli function to call with an argv array in a bin file.
It provide a way to organize complex cli tools in multiple command files,
and use the documentation from these files to generate some help or other input handling.

**Parameters**

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** The name of the cli tool.
-   `version` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number))?** The current version of the cli tool. Used to provide a default version command.
-   `options` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** An object containing some options.
-   `commands` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;CommandDefinition>** An array of commands definitions. Use it to define the commands of your cli.

Returns **CliFunction** A function you can call passing an argv like array. It will run the cli.

## License

cleanquirer is released under [MIT](http://opensource.org/licenses/MIT). 
Copyright (c) 2017-present [Alexis Tessier](https://github.com/AlexisTessier)
