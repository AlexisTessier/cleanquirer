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
	)
};

module.exports = logs;