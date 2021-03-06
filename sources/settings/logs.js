'use strict';

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

const logs = {
	unvalidConfigurationObject: ({config}) => msg(
		`You must provide a valid configuration object to cleanquirer.`,
		`${stringable(config)} is not a valid cleanquirer configuration.`
	),
	unvalidName: () => msg(
		`You must provide a not empty string`,
		`as valid name parameter for your cli tool.`
	),
	unvalidVersion: () => msg(
		`You must provide a not empty string or a number`,
		`as valid version parameter for your cli tool.`
	),
	unvalidOptions: () => (
		`You must provide an object as options parameter for your cli tool.`
	),
	unvalidStdin: () => (
		`You must provide a readable stream as stdin option for your cli tool.`
	),
	unvalidStdout: () => (
		`You must provide a writable stream as stdout option for your cli tool.`
	),
	unvalidStderr: () => (
		`You must provide a writable stream as stderr option for your cli tool.`
	),
	unvalidCommandType: ({name, index, type}) => msg(
		`The provided ${name} command object at index ${index} must be an object.`,
		`Currently, it's of type ${type}.`
	),
	unvalidCommandName: ({name, index}) => (
		`The provided ${name} command object at index ${index} has no name.`
	),
	unvalidCommandAction: ({name, index}) => msg(
		`The provided ${name} command object at index ${index} has no action defined.`,
		`A valid action must be a function.`
	)
};

module.exports = logs;