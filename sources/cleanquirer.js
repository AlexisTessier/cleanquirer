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

	function cli(inputs, cliCallback) {
		assert(Array.isArray(inputs), `When using ${name} as a function, you must provide an input to it as an Array like one from process.argv.slice(2).`);
		
		const cliCallbackIsAFunction = typeof cliCallback === 'function';
		assert(cliCallbackIsAFunction || !cliCallback);

		const cliPromise = cliCallbackIsAFunction ? null : new Promise(resolve => {
			cliCallback = err => {
				err ? reject(err) : resolve();
			};
		});

		const command = inputs.shift();
		const options = {};

		let doneCalled = false;
		function done() {
			doneCalled = true;
			cliCallback(null);
		}

		const action = actions[command].action;
		const actionResult = action(options, done);

		const actionUseCallback = action.length >= 2;
		const actionUsePromise = actionResult instanceof Promise;

		if (actionUseCallback && actionUsePromise) {
			throw new Error(`The ${name} command "${command}" you are trying to use both uses internally a callback and returns a promise. This is not permitted by cleanquirer. If the command is asynchronous, it must use callback or promise but not both.`);
		}

		if(actionUseCallback && doneCalled){
			throw new Error(
				`The ${name} command "${command}" you are trying to use calls internally a callback in a synchronous way. This is not permitted by cleanquirer. If the command is synchronous, it shouldn't use neither callback or promise.`
			);
		}
		
		if(!actionUseCallback){
			cliCallback(null);
		}

		return cliPromise;
	}

	return cli;
}

module.exports = cleanquirer;