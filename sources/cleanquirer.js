'use strict';

const assert = require('assert');

function cleanquirer({
	name,
	commands = []
} = {}) {
	const configType = typeof arguments[0];

	assert(configType === 'object' && !Array.isArray(arguments[0]),
		`You must provide a valid configuration object to cleanquirer. ${configType} is not a valid type for a cleanquirer configuration.`
	);

	const unvalidNameError = `You must provide a not empty string as valid name parameter for your cli tool.`;
	assert(typeof name === 'string', unvalidNameError);
	name = name.trim();
	assert(name.length > 0, unvalidNameError);

	/*----------------*/

	const actions = {};
	commands.forEach(command => {
		actions[command.name] = command;
	});

	function cli(inputs) {
		assert(Array.isArray(inputs), `When using ${name} as a function, you must provide an input to it as an Array like one from process.argv.slice(2)`);

		const command = inputs.shift();
		const options = {};

		actions[command].action(options, cliCallback);

		function cliCallback() {
		}
	}

	return cli;
}

module.exports = cleanquirer;