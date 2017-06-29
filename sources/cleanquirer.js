'use strict';

const assert = require('assert');
const check = require('better-assert');

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
		check(cliCallbackIsAFunction || !cliCallback);

		const cliPromise = cliCallbackIsAFunction ? null : new Promise((resolve, reject) => {
			cliCallback = err => {
				err ? reject(err) : resolve();
			};
		});

		const command = inputs.shift();
		const options = {};

		let doneCalled = false;
		function done(err) {
			doneCalled = true;

			if (err) {
				cliCallback(new Error(`${name} ${command} error: ${err.message}`));
			}
			else{
				cliCallback();
			}
		}

		const action = actions[command].action;

		const actionUseCallback = action.length >= 2;
		let actionResult = null;
		
		try{
			actionResult = action(options, done);
		}
		catch(err){
			throw new Error(
				`Error happen when using the ${name} command "${command}" : ${err.message}`
			);
		}

		const actionUsePromise = actionResult instanceof Promise;

		if (actionUseCallback && actionUsePromise) {
			throw new Error(
				`The ${name} command "${command}" you are trying to use both uses internally a callback and returns a promise. This is not permitted by cleanquirer. If the command is asynchronous, it must use callback or promise but not both.`
			);
		}
		else if (!actionUseCallback && !actionUsePromise) {
			cliCallback(null);
		}
		else if(actionUseCallback && doneCalled){
			throw new Error(
				`The ${name} command "${command}" you are trying to use calls internally a callback in a synchronous way. This is not permitted by cleanquirer. If the command is synchronous, it shouldn't use neither callback or promise.`
			);
		}

		return cliPromise;
	}

	return cli;
}

module.exports = cleanquirer;