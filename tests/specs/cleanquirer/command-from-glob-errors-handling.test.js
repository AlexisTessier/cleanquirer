'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');
const pathFromIndex = require('../../utils/path-from-index');

const mockCommandFile = require('../../mocks/mock-command-file');

const msg = requireFromIndex('sources/msg');

/*---------------------------*/

function wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro(t, wrongInput) {
	t.plan(2);

	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/two-match-doc-and-no-doc/*')
		]
	});

	const wrongCliInputError = t.throws(() => {
		myCli(wrongInput);
	});

	t.is(wrongCliInputError.message, `When using mycli as a function, you must provide an input to it as an Array like one from process.argv.slice(2).`);
		
	t.end();
}

wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro.title = (providedTitle, input) => (
	`Synchronous usage - When defining command from glob, throws error if provided input is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`);

function wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro(t, wrongInput) {
	t.plan(2);

	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/two-match-doc-and-no-doc/*')
		]
	});

	const wrongCliInputError = t.throws(() => {
		myCli(wrongInput).then(() => {
			t.fail();
		});
	});

	t.is(wrongCliInputError.message, `When using mycli as a function, you must provide an input to it as an Array like one from process.argv.slice(2).`);
		
	t.end();
}

wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro.title = (providedTitle, input) => (
	`Promise usage - When defining command from glob, throws error if provided input is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`);

function wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro(t, wrongInput) {
	t.plan(2);

	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/two-match-doc-and-no-doc/*')
		]
	});

	const wrongCliInputError = t.throws(() => {
		myCli(wrongInput, ()=>{
			t.fail();
		});
	});

	t.is(wrongCliInputError.message, `When using mycli as a function, you must provide an input to it as an Array like one from process.argv.slice(2).`);
	
	t.end();
}

wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro.title = (providedTitle, input) => (
	`Callback usage - When defining command from glob, throws error if provided input is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`);

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro);
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, undefined);
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, {});
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, 2);
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, true);
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, false);
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, null);
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, '  ');
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, 'wrong input');
test.cb(wrongCliInputWithCommandsDefinedFromGlobSynchronousUsageMacro, function () {});

test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro);
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, undefined);
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, {});
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, 2);
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, true);
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, false);
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, null);
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, '  ');
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, 'wrong input');
test.cb(wrongCliInputWithCommandsDefinedFromGlobPromiseUsageMacro, function () {});

test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro);
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, undefined);
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, {});
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, 2);
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, true);
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, false);
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, null);
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, '  ');
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, 'wrong input');
test.cb(wrongCliInputWithCommandsDefinedFromGlobCallbackUsageMacro, function () {});

/*---------------------------*/

test('Command definition from no matching glob', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullPath = pathFromIndex('tests/mocks/mock-commands/from-glob/no-matching-glob/*.js');

	const noMatchingError = t.throws(() => {
		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js'),
				fullPath
			]
		});
	});

	t.is(noMatchingError.message, `The provided glob "${fullPath}" at index index 1 matches no files.`);
});

test('Command definition from no matching files glob (but matching directory)', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullPath = pathFromIndex('tests/mocks/mock-commands/from-glob/no-matching-files-glob/*');

	const noMatchingFilesError = t.throws(() => {
		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js'),
				fullPath
			]
		});
	});

	t.is(noMatchingFilesError.message, `The provided glob "${fullPath}" at index index 1 matches no files.`);
});

test('Command definition from glob matching extensionless files', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullPath = pathFromIndex('tests/mocks/mock-commands/from-glob/match-extensionless-files/*');

	const matchingExtensionLessFileError = t.throws(() => {
		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				fullPath,
				pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js')
			]
		});
	});

	t.is(matchingExtensionLessFileError.message, msg(
		`The provided glob "${fullPath}" at index index 0 matches`,
		`a file without extension ("${fullPath.replace('*', 'command')}").`,
		`A valid command module file must be a javascript file (.js).`
	));
});

test('Command definition from glob matching no js files', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullPath = pathFromIndex('tests/mocks/mock-commands/from-glob/match-nojs-file/*');

	const matchingNoJSFileError = t.throws(() => {
		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js'),
				fullPath
			]
		});
	});

	t.is(matchingNoJSFileError.message, msg(
		`The provided glob "${fullPath}" at index index 1 matches`,
		`a .txt file ("${fullPath.replace('*', 'command.txt')}").`,
		`A valid command module file must be a javascript file (.js).`
	));
});

/*------------------------------*/
/*------------------------------*/
/*------------------------------*/

async function handlingAsyncErrorMacro(t, {
	command,
	errorType,
	errorMessage
}) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(4);

	const actionFunction = requireFromIndex(`tests/mocks/mock-commands/from-glob/${command}/command`);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex(`tests/mocks/mock-commands/from-glob/${command}/*`)
		]
	});

	t.is(actionFunction.callCount, 0);

	try{
		await myCli(['command']);
		t.fail();
	}
	catch(err){
		t.is(actionFunction.callCount, 1);
		t.is(err.constructor.name, errorType);
		t.is(err.message, errorMessage);
	}
}

/*------------------------------*/

test('Command definition from glob synchronously throwing error', handlingAsyncErrorMacro, {
	command: 'synchronously-throwing-error',
	errorType: 'Error',
	errorMessage: 'Error happen when using the mycli command "command" : throwing-error-command-error'
});

test('Command definition from glob synchronously callback without error', handlingAsyncErrorMacro, {
	command: 'callback-synchronously-called-without-error',
	errorType: 'CleanquirerCommandImplementationError',
	errorMessage: msg(
		'The mycli command "command" you are trying to use',
		'calls internally a callback in a synchronous way.',
		'This is not permitted by cleanquirer. If the command is synchronous,',
		'it shouldn\'t use neither callback or promise.'
	)
});

test('Command definition from glob synchronously callback with error', handlingAsyncErrorMacro, {
	command: 'callback-synchronously-called-with-error',
	errorType: 'CleanquirerCommandImplementationError',
	errorMessage: msg(
		'The mycli command "command" you are trying to use',
		'calls internally a callback in a synchronous way.',
		'This is not permitted by cleanquirer. If the command is synchronous,',
		'it shouldn\'t use neither callback or promise.'
	)
});

test('Command definition from glob internally using both callback and promise', handlingAsyncErrorMacro, {
	command: 'using-both-callback-and-promise',
	errorType: 'CleanquirerCommandImplementationError',
	errorMessage: msg(
		'The mycli command "command" you are trying to use both uses internally',
		'a callback and returns a promise. This is not permitted by cleanquirer.',
		'If the command is asynchronous, it must use callback or promise but not both.'
	)
});


test('Command definition from glob internally using both callback and promise and calling the callback', handlingAsyncErrorMacro, {
	command: 'using-both-callback-and-promise-and-calling-the-callback',
	errorType: 'CleanquirerCommandImplementationError',
	errorMessage: msg(
		'The mycli command "command" you are trying to use calls internally a callback in a synchronous way.',
		'This is not permitted by cleanquirer. If the command is synchronous,',
		'it shouldn\'t use neither callback or promise.'
	)
});

test('Command definition from glob internally using both callback and promise and calling the callback asynchronously', handlingAsyncErrorMacro, {
	command: 'using-both-callback-and-promise-and-calling-the-callback-asynchronously',
	errorType: 'CleanquirerCommandImplementationError',
	errorMessage: msg(
		'The mycli command "command" you are trying to use',
		'both uses internally a callback and returns a promise.',
		'This is not permitted by cleanquirer. If the command is asynchronous,',
		'it must use callback or promise but not both.'
	)
});

test('Command definition from glob asynchronously calling the callback with an error', handlingAsyncErrorMacro, {
	command: 'asynchronously-calling-callback-with-error',
	errorType: 'Error',
	errorMessage: msg(
		'mycli command error: asynchronous-callback-call-with-error-command-error'
	)
});

test.todo('Command definition from glob returning rejecting promise');

test.todo('undefined command handling');
test.todo('duplicate glob handling');
test.todo('duplicate command handling');