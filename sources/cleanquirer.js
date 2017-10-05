'use strict';

const assert = require('assert');
const path = require('path');

const isGlob = require('is-glob');
const glob = require('glob');

const msg = require('./msg');
const deduceCommandObjectFromFile = require('./deduce-command-object-from-file');

class CleanquirerCommandImplementationError extends Error{}

function cleanquirer({
	name,
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
					`at index index ${i} matches no files.`
				));

				commandFiles.forEach(globFileCommand => {
					const extname = path.extname(globFileCommand);

					assert(extname.length > 0, msg(
						`The provided glob "${command}"`,
						`at index index ${i} matches a file without extension ("${globFileCommand}").`,
						`A valid command module file must be a javascript file (.js).`
					));

					assert(extname === '.js', msg(
						`The provided glob "${command}"`,
						`at index index ${i} matches a ${extname} file ("${globFileCommand}").`,
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
		}

		return cliPromise;
	}

	function _cli(inputs, cliCallback, cliCallbackIsAFunction) {
		inputs = [...inputs];

		assert(typeof cliCallbackIsAFunction === 'boolean');

		const cliPromise = cliCallbackIsAFunction ? null : new Promise((resolve, reject) => {
			cliCallback = err => {
				err ? reject(err) : resolve();
			};
		});

		const command = inputs.shift();

		assert(typeof actions[command] === 'object',
			`The command "${command}" is not a command of "${name}".`
		);

		/*------------------*/

		let tickChange = 0;

		process.nextTick(()=>{
			tickChange++;
		});

		function done(commandError) {
			if(tickChange === 0){
				throw new CleanquirerCommandImplementationError(msg(
					`The ${name} command "${command}" you are trying to use`,
					`calls internally a callback in a synchronous way.`,
					`This is not permitted by cleanquirer.`,
					`If the command is synchronous, it shouldn't`,
					`use neither callback or promise.`
				));
			}
			else{
				if (commandError) {
					cliCallback(new Error(
						`${name} ${command} error: ${commandError.message}`
					));
				}
				else{
					cliCallback();
				}
			}
		}

		/*------------------*/

		const action = actions[command].action;
		let actionResult = null;
		const actionOptions = {
			stdout: process.stdout,
			stderr: process.stderr,
			stdin: process.stdin
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

		const actionUseCallback = action.length >= 2;
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

			actionResult.then(() => done()).catch(err => done(err));
		}
		else if (!actionUseCallback) {
			cliCallback(null);
		}

		return cliPromise;
	}

	return cli;
}

module.exports = cleanquirer;