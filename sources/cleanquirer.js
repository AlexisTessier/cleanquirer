'use strict';

const assert = require('assert');
const path = require('path');

const isStream = require('is-stream');
const isGlob = require('is-glob');
const glob = require('glob');

const msg = require('@alexistessier/msg');

const deduceCommandObjectFromFile = require('./deduce-command-object-from-file');

const {
	unvalidConfigurationObject: UNV_CON,
	unvalidName: UNV_NAM,
	unvalidVersion: UNV_VER,
	unvalidOptions: UNV_OPS,
	unvalidStdin: UNV_STD_IN,
	unvalidStdout: UNV_STD_OUT,
	unvalidStderr: UNV_STD_ERR,
	unvalidCommandType: UNV_CMD_TYP,
	unvalidCommandName: UNV_CMD_NAM,
	unvalidCommandAction: UNV_CMD_ACT
} = require('./settings/logs');

const makeDefaultCommands = require('./tools/make-default-commands');
const getTypedValue = require('./tools/get-typed-value');

/**
 * @description An error thrown when a command seems to have an implementation issue.
 */
class CleanquirerCommandImplementationError extends Error{}

/**
 * @description An object containing the options which will be used by default in the cli commands actions.
 *
 * @param options
 * @param {ReadableStream=process.stdin} options.stdin The stdin stream used by the cli.
 * @param {WritableStream=process.stdout} options.stdout The stdout stream used by the cli.
 * @param {WritableStream=process.stderr} options.stderr The stderr stream used by the cli.
 */
function CliOptionsObject({
	stdin = process.stdin,
	stdout = process.stdout,
	stderr = process.stderr
}) {
	assert(stdin === undefined || isStream.readable(stdin), UNV_STD_IN());
	assert(stdout === undefined || isStream.writable(stdout), UNV_STD_OUT());
	assert(stderr === undefined || isStream.writable(stderr), UNV_STD_ERR());

	return { stdin, stdout, stderr }
}

/**
 * @description Create a cli function to call with an argv array in a bin file.
 * It provide a way to organize complex cli tools in multiple command files,
 * and use the documentation from these files to generate some help or other input handling.
 *
 * @param config
 * @param {string} config.name The name of the cli tool.
 * @param {string|number} config.version The current version of the cli tool. Used to provide a default version command.
 * @param {CliOptionsObject} config.options
 * @param {CommandDefinition[]} config.commands An array of commands definitions. Use it to define the commands of your cli.
 * @return {CliFunction} A function you can call passing an argv like array. It will run the cli.
 */
function cleanquirer({
	name,
	version = 'unversioned',
	options = {},
	commands = []
} = {}) {
	const config = arguments[0];
	const configType = typeof config;

	assert(configType === 'object' && !Array.isArray(config), UNV_CON({config}));

	assert(typeof name === 'string', UNV_NAM());
	name = name.trim();
	assert(name.length > 0, UNV_NAM());

	assert(typeof version === 'string' || typeof version === 'number', UNV_VER());
	version = `${version}`.trim();
	assert(version.length > 0, UNV_VER());

	assert(options && typeof options === 'object' && !(options instanceof Array), UNV_OPS());
	const { stdin, stdout, stderr } = CliOptionsObject(options);

	/*----------------*/

	const defaultCommands = makeDefaultCommands({cliName: name, version});

	/*----------------*/

	const actions = {};
	const duplicateCommandDetectionAddActionCache = {};
	function addAction(commandObject, index) {
		const type = typeof commandObject;
		assert(type === 'object', UNV_CMD_TYP({ name, index, type }));
		assert(typeof commandObject.name === 'string', UNV_CMD_NAM({ name, index }));
		assert(typeof commandObject.action === 'function', UNV_CMD_ACT({ name, index }));

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

		const optionsDefinitions = commandObject.options || [];
		const numberOfOptions = optionsDefinitions.length
		if (inputs.length > numberOfOptions) {
			let requirements;
			switch(numberOfOptions){
				case 0:
					requirements = 'no option';
					break;
				case 1:
					requirements = 'only 1 option';
					break;
				default:
					requirements = `only ${numberOfOptions} options`;
					break;
			}

			const unknowIndex = numberOfOptions;
			const unknow = inputs[unknowIndex];

			throw new Error(msg(
				`${name} ${command} requires ${requirements} but found value`,
				`${JSON.stringify(unknow)} for an unknow option at position ${unknowIndex+1}.`
			));
		}

		optionsDefinitions.forEach(optionDefinition => {
			const {
				name: optionName,
				hasDefaultValue,
				type
			} = optionDefinition;

			if (inputs.length > 0) {
				actionOptions[optionName] = getTypedValue(inputs.shift(), type);
			}
			else if (!hasDefaultValue) {
				throw new Error(
					`${name} ${command} requires a missing option "${optionName}".`
				);
			}
		});

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