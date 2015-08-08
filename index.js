/*
            _                   ____          _
           / \   _ __  _   _   / ___|___   __| | ___
          / _ \ | '_ \| | | | | |   / _ \ / _` |/ _ \
         / ___ \| | | | |_| | | |__| (_) | (_| |  __/
        /_/   \_\_| |_|\__, |  \____\___/ \__,_|\___|
                       |___/

        route-cli
 */

var obj = require('javascript-object-paraphernalia'),
    router = (function(){

        function Router() {
            this.commands = {};
        }

        /**
         * @description execute any registered routes matching the given set of command line arguments. By default
         *  the arguments will be the active process' command line arguments without node's execution and application
         *  paths
         *
         * @param {Array<String>} args
         */
        Router.prototype.execute = function(args) {
            if (args === undefined) {
                args = process.argv.slice(2);
            }

            //collect any flags so that they can be provided back to the handler
            var flags = [].concat(this.collectFlags(args));

            //collect any action commands for routing to a specific handler
            var actions = [].concat(this.collectActions(args, 0, router.commands));

            //execute any matching route handlers
            for (action in actions) {
                var $action = actions[action];
                $action.action.call(this, $action.commandPath, args.slice($action.commandPath.length), flags);
            }
        };

        /**
         * @description register a route providing an array of commands and the route handler callback
         *
         * @param {Array<String>} commandPath
         * @param {function} action
         */
        Router.prototype.route = function(commandPath, action) {
            var data = {
                    structure: {}
                },
                tier = data.structure;

            var nextLevel = data.structure;
            for (command in commandPath) {
                nextLevel[commandPath[command]] = {};
                nextLevel = nextLevel[commandPath[command]];
            }

            nextLevel.action = {
                commandPath: commandPath,
                action: action
            };
            obj.merge(this.commands, data.structure);
            this.initializeCommandMatchers(this.commands);
        };

        /**
         * @description generates a list describing the commands that have currently been registered for the given
         *  set of routes
         *
         * @returns {Array<String>}
         */
        Router.prototype.describe = function() {
            var describeCommands = [],
                traverseAvailableCommands = function(obj) {
                    for (item in obj) {
                        if (obj[item].commandPath !== undefined) {
                            describeCommands.push(obj[item].commandPath.join(" "));
                        } else {
                            traverseAvailableCommands(obj[item]);
                        }
                    }
                };

            traverseAvailableCommands(router.commands);
            return describeCommands;
        };

        /**
         * Adds matchExpressions to any registered command
         *
         * @param commands
         */
        Router.prototype.initializeCommandMatchers = function(commands) {
            function propertyIsCommand(prop) {
                return prop !== 'action' && prop !== 'matches';
            }

            function addMatchExpressionsForCommand(commands, commandName) {
                var command = commands[commandName];
                if (!command.matches) {
                    command.matches = new RegExp("^" + commandName + "$", "i");
                }
                instrumentCommands(command);
            }

            function instrumentCommands(commands) {
                for (commandName in commands) {
                    if (commands.hasOwnProperty(commandName) && propertyIsCommand(commandName)) {
                        addMatchExpressionsForCommand(commands, commandName);
                    }
                }
            }
            instrumentCommands(commands);
        };

        /**
         * @description Mutates args based on collected arguments beginning with either - or / which we consider to be
         *  flags and not actions
         *
         * @param {Array<String>} args
         * @returns {Array<String>}
         */
        Router.prototype.collectFlags = function(args) {
            if (args.length === 0) {
                return [];
            }
            var flags = [];
            for (i=args.length-1; i>=0; i--) {
                if (args[i].match(/^[-\/]/)) {
                    flags.push(args[i]);
                    args.splice(i, 1);
                }
            }

            return flags.reverse();
        };

        /**
         * @description build a command hierarchy by collecting registered route actions.
         *
         * @param {Array<String>} args
         * @param {Integer} argumentIndex
         * @param {Object} commandHierarchyObject
         * @returns {Array}
         */
        Router.prototype.collectActions = function(args, argumentIndex, commandHierarchyObject) {
            if (args.length === 0) {
                return [];
            }

            var $this = this,
                argument = args[argumentIndex],
                actions = [];

            function shouldntEvaluateProperty(entity, prop) {
                return !entity.hasOwnProperty(prop) || !entity[prop].matches;
            }

            function commandHasAction(argument, command) {
                return argument.match(command.matches) && command.action
            }

            function evaluateCommand(entity, commandName, argument) {
                if (shouldntEvaluateProperty(entity, commandName)) {
                    return [];
                }
                var command = entity[commandName],
                    actions = [];
                if (commandHasAction(argument, command)) {
                    actions.push(command.action);
                }
                if (argument.match(command.matches)) {
                    actions = actions.concat($this.collectActions(args, argumentIndex + 1, command));
                }
                return actions;
            }

            for (commandName in commandHierarchyObject) {
                actions = actions.concat(evaluateCommand(commandHierarchyObject, commandName, argument));
            }
            return actions;
        };

        return new Router();
    })();

module.exports = router;
