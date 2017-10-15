'use strict';

const assert = require('assert');
const path = require('path');

const isStream = require('is-stream');
const isGlob = require('is-glob');
const glob = require('glob');

// get parent module version
const readPkgUp = require('read-pkg-up');
const parentModule = require('parent-module');

const msg = require('./msg');
const deduceCommandObjectFromFile = require('./deduce-command-object-from-file');

class CleanquirerCommandImplementationError extends Error{}

const defaultVersion = readPkgUp.sync({cwd: path.dirname(parentModule())}).pkg.version;

function cleanquirer({
	name,
	version = defaultVersion,
	options = {},
	commands = []
} = {}) {
	const configType = typeof arguments[0];

	assert(configType === 'object' && !Array.isArray(arguments[0]), msg(
		`You must provide a valid configuration object to cleanquirer.`,
		`${configType} is not a valid type for a cleanquirer configuration.`
	));

	const unvalidNameError = msg(
		`You must provide a not empty string`,
		`as valid name parameter for your cli tool.`
	);
	assert(typeof name === 'string', unvalidNameError);
	name = name.trim();
	assert(name.length > 0, unvalidNameError);

	assert(options && typeof options === 'object' && !(options instanceof Array),
		`You must provide an object as options parameter for your cli tool.`
	);

	/*----------------*/

	assert(options.stdin === undefined || isStream.readable(options.stdin),
		`You must provide a readable stream as stdin option for your cli tool.`
	);

	assert(options.stdout === undefined || isStream.writable(options.stdout),
		`You must provide a writable stream as stdout option for your cli tool.`
	);

	assert(options.stderr === undefined || isStream.writable(options.stderr),
		`You must provide a writable stream as stderr option for your cli tool.`
	);

	const stdin = options.stdin || process.stdin;
	const stdout = options.stdout || process.stdout;
	const stderr = options.stderr || process.stderr;

	/*----------------*/

	const defaultCommands = [{
		name: 'version',
		action({
			stdout
		}){
			stdout.write(`${name} version ${version}\n`);

			return version;
		}
	}].reduce((hashmap, command) => {
		hashmap[command.name] = command;
		return hashmap;
	}, {});

	/*----------------*/

	const actions = {};
	const duplicateCommandDetectionAddActionCache = {};
	function addAction(commandObject, index) {
		assert(typeof commandObject === 'object', msg(
			`The provided ${name} command object`,
			`at index ${index} must be an object.`,
			`Currently, it's of type ${typeof commandObject}.`
		));

		assert(typeof commandObject.name === 'string', msg(
			`The provided ${name} command object`,
			`at index ${index} has no name.`
		));

		assert(typeof commandObject.action === 'function', msg(
			`The provided ${name} command object`,
			`at index ${index} has no action defined.`,
			`A valid action must be a function.`
		));

		if (typeof actions[commandObject.name] !== 'undefined') {
			const sortedIndex = [index, duplicateCommandDetectionAddActionCache[commandObject.name]].sort();
			throw new Error(msg(
				`"${name}" define a duplicate command "${commandObject.name}"`,
				`in commands Array parameter at indexes`,
				`${sortedIndex[0]} and ${sortedIndex[1]}.`
			));
		}

		duplicateCommandDetectionAddActionCache[commandObject.name] = index;
		actions[commandObject.name] = commandObject;
	}

	const actionsFromFile = [];
	const duplicateCommandFilepathDetectionCache = {};
	const duplicateCommandGlobDetectionCache = {};
	commands.forEach((command, i) => {
		assert(command && typeof command === 'object' || typeof command === 'string', msg(
			`The provided ${name} command path "${command}"`,
			`at index ${i} is neither an object or an absolute path.`
		));

		if (typeof command === 'string') {
			function deduceFromFileAndAdd(commandFilepath, fromGlobIndexSuffix = ''){
				actionsFromFile.push(deduceCommandObjectFromFile(commandFilepath).then(commandObject => {
					addAction(commandObject, `${i} (${commandFilepath})${fromGlobIndexSuffix}`);
				}));
			}

			if (isGlob(command)) {
				assert(path.isAbsolute(command), msg(
					`The provided ${name} glob "${command}"`,
					`at index ${i} is not absolute.`
				));

				assert(!Object.keys(duplicateCommandGlobDetectionCache).includes(command), msg(
					`"${name}" use a duplicate glob "${command}"`,
					`in commands Array parameter at indexes`,
					`${duplicateCommandGlobDetectionCache[command]} and ${i}`,
					`to define a command.`
				));

				duplicateCommandGlobDetectionCache[command] = i;

				const commandFiles = glob.sync(command, {nodir: true});

				assert(commandFiles.length > 0, msg(
					`The provided glob "${command}"`,
					`at index ${i} matches no files.`
				));

				commandFiles.forEach(globFileCommand => {
					const extname = path.extname(globFileCommand);

					assert(extname.length > 0, msg(
						`The provided glob "${command}"`,
						`at index ${i} matches a file without extension ("${globFileCommand}").`,
						`A valid command module file must be a javascript file (.js).`
					));

					assert(extname === '.js', msg(
						`The provided glob "${command}"`,
						`at index ${i} matches a ${extname} file ("${globFileCommand}").`,
						`A valid command module file must be a javascript file (.js).`
					));

					deduceFromFileAndAdd(globFileCommand, ` from glob "${command}"`);
				});
			}
			else{
				assert(path.isAbsolute(command), msg(
					`The provided ${name} command path "${command}"`,
					`at index ${i} is not an absolute path.`
				));

				assert(!Object.keys(duplicateCommandFilepathDetectionCache).includes(command), msg(
					`"${name}" use a duplicate filepath "${command}"`,
					`in commands Array parameter at indexes`,
					`${duplicateCommandFilepathDetectionCache[command]} and ${i}`,
					`to define a command.`
				));

				duplicateCommandFilepathDetectionCache[command] = i;
				deduceFromFileAndAdd(command);
			}
		}
		else{
			addAction(command, i);
		}
	});

	let cliReady = !actionsFromFile.length;

	const readyPromise = cliReady ? null : Promise.all(actionsFromFile).then(()=>cliReady = true);

	function cli(inputs, cliCallback) {
		assert(Array.isArray(inputs), msg(
			`When using ${name} as a function,`,
			`you must provide an input to it`,
			`as an Array like one from process.argv.slice(2).`
		));

		const cliCallbackIsAFunction = typeof cliCallback === 'function';
		assert(cliCallbackIsAFunction || !cliCallback);

		if (cliReady) {
			return _cli(inputs, cliCallback, cliCallbackIsAFunction);
		}

		const cliPromise = readyPromise.then(()=> _cli(inputs, cliCallback, cliCallbackIsAFunction));

		if (typeof cliCallback === 'function') {
			cliPromise.catch(err => cliCallback(err));

			return null;
		}

		return cliPromise;
	}

	function _cli(inputs, cliCallback, cliCallbackIsAFunction) {
		inputs = [...inputs];

		assert(typeof cliCallbackIsAFunction === 'boolean');

		const cliPromise = cliCallbackIsAFunction ? null : new Promise((resolve, reject) => {
			cliCallback = (err, result) => {
				err ? reject(err) : resolve(result);
			};
		});

		const command = inputs.shift();

		const commandObject = actions[command] || defaultCommands[command];

		assert(typeof commandObject === 'object',
			`The command "${command}" is not a command of "${name}".`
		);

		/*------------------*/

		let tickChange = 0;

		process.nextTick(()=>{
			tickChange++;
		});

		const action = commandObject.action;
		const actionUseCallback = action.length >= 2;

		function done(commandError, commandValueFromCallback) {
			if(actionUseCallback && tickChange === 0){
				throw new CleanquirerCommandImplementationError(msg(
					`The ${name} command "${command}" you are trying to use`,
					`calls internally a callback in a synchronous way.`,
					`This is not permitted by cleanquirer.`,
					`If the command is synchronous, it shouldn't`,
					`use neither callback or promise.`
				));
			}
			else{
				const argsKeys = Object.keys(arguments);
				if (commandError !== undefined && commandError !== null && !(commandError instanceof Error)) {
					cliCallback(new CleanquirerCommandImplementationError(msg(
						`The ${name} command "${command}" you are trying to use`,
						`calls internally a callback with a unvalid error value: (${typeof commandError}) ${commandError}.`,
						`If the command uses a callback, the error parameter at first position can only be null or undefined`,
						`if no error, or an instance of Error, like this:`,
						`callback(new Error("An error message")).`,
						`If the command is supposed to call the callback with a value,`,
						`it must use the second argument like this: callback(null, 'command result')`
					)));
				}
				else if (commandError) {
					cliCallback(new Error(
						`${name} ${command} error: ${commandError.message}`
					));
				}
				else if(argsKeys.length > 2){
					const args = argsKeys.map(key => arguments[key]).map(val => `${val}`);

					cliCallback(new CleanquirerCommandImplementationError(msg(
						`The ${name} command "${command}" you are trying to use`,
						`calls internally a callback with more than one value (${args.join(', ')}).`,
						`This is not permitted by cleanquirer.`,
						`If the command uses a callback, it should only be called`,
						`with a maximum of 2 arguments: one error or null and one value eventually,`,
						`like this: callback(err, 'a value').`
					)));
				}
				else{
					cliCallback(null, commandValueFromCallback);
				}
			}
		}

		/*------------------*/

		let actionResult = null;
		const actionOptions = {
			cli,
			stdout,
			stderr,
			stdin
		};

		try{
			actionResult = action(actionOptions, done);
		}
		catch(err){
			if (err instanceof CleanquirerCommandImplementationError) {
				throw err;
			}

			throw new Error(msg(
				`Error happen when using the ${name} command "${command}" : ${err.message}`
			));
		}

		const actionUsePromise = actionResult instanceof Promise;

		if(actionUsePromise){
			if (actionUseCallback) {
				throw new CleanquirerCommandImplementationError(msg(
					`The ${name} command "${command}" you are trying to use`,
					`both uses internally a callback and returns a promise.`,
					`This is not permitted by cleanquirer.`,
					`If the command is asynchronous, it must use`,
					`callback or promise but not both.`
				));
			}

			actionResult.then(result => done(null, result)).catch(err => done(err));
		}
		else if (actionUseCallback && actionResult !== undefined) {
			throw new CleanquirerCommandImplementationError(msg(
				`The ${name} command "${command}" you are trying to use`,
				`both uses internally a callback and returns a value (${actionResult}) of type ${typeof actionResult}.`,
				`This is not permitted by cleanquirer.`,
				`If the command uses a callback, it must not return a value.`,
				`Eventually, it can pass that value as the second parameter of the callback like this:`,
				`callback(null, resultValue)`
			));
		}
		else if (!actionUseCallback) {
			cliCallback(null, actionResult);
		}

		return cliPromise;
	}

	Object.defineProperty(cli, "name", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: name
	});

	Object.defineProperty(cli, "version", {
		enumerable: false,
		configurable: false,
		writable: false,
		value: version
	});

	return cli;
}

module.exports = cleanquirer;