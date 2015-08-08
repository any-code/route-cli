#! /usr/bin/env node
var router = require('./index');

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

router.execute();


