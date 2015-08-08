#! /usr/bin/env node
var router = require('./index');

// @example-command: {appname}
router.default(function(command, additionalCommands, flags) {

    console.log("Called with no commands", command, additionalCommands, flags);

});

// @example-command: {appname} test case --save
router.route(['test', 'case'], function(command, additionalCommands, flags) {

    console.log("Called (test->case) with --save flag", command, additionalCommands, flags);

});

// @example-command: {appname} example with more arguments
router.route(['example', 'with', 'more', 'arguments'], function(command) {

    console.log("Called (example->with->more->arguments)", command);

});

// @example-command: {appname} example --deflate arguments one two three
router.route(['example', 'arguments'], function(command, additionalCommands, flags) {

    console.log("Called (example->arguments->[one->two->three]) with --deflate flag", command, additionalCommands, flags);

});

// router.execute() with no arguments will default to process.argv.slice(2)
router.execute([]);
router.execute(['unknown']);
router.execute(['test', 'case', '--save']);
router.execute(['example', 'with', 'more', 'arguments']);
router.execute(['example', '--deflate', 'arguments', 'one', 'two', 'three']);
