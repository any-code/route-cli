var router = require('../index');

exports.testCorrectRoute = function(test) {
    var called = false;

    router.route(['hello', 'world'], function() { called = true; });
    router.execute(['hello', 'world']);

    test.ok(called, "command hello->world was not called");
    test.done();
};

exports.testIncorrectRoute = function(test) {
    var called = false;

    router.route(['hello', 'world'], function() { called = true; });
    router.execute(['hello', 'moon']);

    test.ok(!called, "command hello->world was called even though the route was incorrect");
    test.done();
};

exports.testAdditionalCommands = function(test) {
    var called = false,
        additionalCommands = [];

    router.route(['hello', 'world'], function(command, args) {
        called = true;
        additionalCommands = args;
    });
    router.execute(['hello', 'world', 'planet', 'earth']);

    test.ok(called, "command hello->world was not called");
    test.deepEqual(additionalCommands, ['planet', 'earth'], "additional commands " + additionalCommands.join(',') +
        "were not captured");

    test.done();
};

exports.testFlags = function(test) {
    var called = false,
        commandFlags = [];

    router.route(['destroy', 'world'], function(command, args, flags) {
        called = true;
        commandFlags = flags;
    });
    router.execute(['--fire', 'destroy', '--on=3', 'world']);

    test.ok(called, "command destroy->world was not called");
    test.deepEqual(commandFlags, ['--fire', '--on=3'], "command flags " + commandFlags.join(',') +
        "were not captured");

    test.done();
};

exports.testDescribe = function(test) {
    var fn = function() {};

    router.route(['destroy', 'world'], fn);
    router.route(['save', 'world'], fn);
    router.route(['destroy', 'moon'], fn);
    router.route(['save', 'moon'], fn);

    var describedCommands = router.describe();

    test.ok(describedCommands.length === 4, "described " + describedCommands.length + " but expected" +
        " to describe 4");
    test.equal(describedCommands[0], "destroy world", "the described command did not match the expected " +
        "'destroy world'");
    test.done();
};

exports.testDefault = function(test) {
    var called = false;

    router.default(function() { called = true;  });
    router.execute([]);

    test.ok(called, "default command was not called");
    test.done();
};

exports.tearDown = function (callback) {
    router.commands = [];
    callback();
};




