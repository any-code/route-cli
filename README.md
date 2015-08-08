# route-cli

> Command router for nodeJs CLI applications 

## Getting Started

### 1. Installation

``` bash
npm install route-cli
```

### 2. Examples

``` javascript
#! /usr/bin/env node
var router = require('route-cli');

// basic route
// @example-command: {appname} example --save
router.route(['test', 'case'], function(command, additionalCommands, flags) {

    console.log("Called (test->case)", command, additionalCommands, flags);

});

// nested route
// @example-command: {appname} example with more arguments
router.route(['with', 'more', 'arguments'], function(command, additionalCommands, flags) {

    console.log("Called (with->more->arguments)", command, additionalCommands, flags);

});

// any remaining CLI arguments are passed into the route handler as the second argument
// @example-command: {appname} example arguments one two three
// where 'one', 'two' and 'three' are passed as an array to the route handler.
router.route(['example', 'arguments'], function(command, additionalCommands, flags) {

    console.log("Called (example->arguments[one,two,three])", command, additionalCommands, flags);

});

//Execute the application either passing in the process.argv other array or just use defaults
router.execute();

```

## Copyright and license
Copyright (c) 2015, Any Code <lee@anycode.io>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
