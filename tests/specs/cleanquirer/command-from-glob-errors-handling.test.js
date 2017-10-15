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

test('Command definition from glob returning rejecting promise', handlingAsyncErrorMacro, {
	command: 'returning-rejecting-error-promise',
	errorType: 'Error',
	errorMessage: msg(
		'mycli command error: rejecting-promise-command-error'
	)
});

test('non absolute glob', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const notAbsoluteGlobError = t.throws(() => {
		cleanquirer({
			name: 'cli',
			commands: [
				'non/absolute/path/*'
			]
		});
	});

	t.is(notAbsoluteGlobError.message, 'The provided cli glob "non/absolute/path/*" at index 0 is not absolute.');
});

test('undefined command handling', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(2);

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js')
		]
	});

	try{
		await myCli(['undefined-command']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, 'The command "undefined-command" is not a command of "cli".');
	}
	
});

test('duplicate glob handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullPath = pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js');

	const duplicateGlobError = t.throws(() => {
		cleanquirer({
			name: 'duplicate-glob-cli',
			commands: [
				fullPath,
				pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-empty-comment/*.js'),
				fullPath
			]
		})
	});

	t.is(duplicateGlobError.message, msg(
		`"duplicate-glob-cli" use a duplicate glob "${fullPath}"`,
		`in commands Array parameter at indexes 0 and 2 to define a command.`
	));
});

test('duplicate command handling', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(2);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/duplicate-commands-from-files/*.js');

	const myCli = cleanquirer({
		name: 'duplicate-command-cli',
		commands: [
			fullPath,
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js')
		]
	});

	try{
		await myCli(['whatever']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, msg(
			`"duplicate-command-cli" define a duplicate command "duplicate-command-name"`,
			`in commands Array parameter at indexes`,
			`0 (${fullPath.replace('*', 'doc-duplication')}) from glob "${fullPath}" and`,
			`0 (${fullPath.replace('*', 'doc')}) from glob "${fullPath}".`
		));
	}
});

test('duplicate command handling from two globs', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(2);

	const fullPathOne = pathFromIndex('tests/mocks/mock-commands/from-glob/duplicate-glob-one/*.js');
	const fullPathTwo = pathFromIndex('tests/mocks/mock-commands/from-glob/duplicate-glob-two/*.js');

	const myCli = cleanquirer({
		name: 'duplicate-command-cli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-no-doc/*.js'),
			fullPathOne,
			fullPathTwo
		]
	});

	try{
		await myCli(['whatever']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, msg(
			`"duplicate-command-cli" define a duplicate command "duplicate-command-name-from-two-glob"`,
			`in commands Array parameter at indexes`,
			`1 (${fullPathOne.replace('*', 'one-match-one')}) from glob "${fullPathOne}" and`,
			`2 (${fullPathTwo.replace('*', 'one-match-two')}) from glob "${fullPathTwo}".`
		));
	}
});

/*------------------------------*/

function callbackCalledWithMoreThanOneValueMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const glob = pathFromIndex('tests/mocks/mock-commands/from-glob/callback-called-with-more-than-one-value/*.js');

	const myCli = cleanquirer({
		name: 'cli-test',
		commands: [
			glob
		]
	});

	core(t, myCli);
}

callbackCalledWithMoreThanOneValueMacro.title = providedTitle => (
	`Action with a callback called with more than one value - ${providedTitle}`);

const callbackCalledWithMoreThanOneValueErrorMessage = (command, excedentValues) => msg(
	`The cli-test command "${command}" you are trying to use`,
	`calls internally a callback with more than one value (null, value-one, ${excedentValues}).`,
	`This is not permitted by cleanquirer. If the command uses a callback, it should only`,
	`be called with a maximum of 2 arguments: one error or null and one value eventually, like this: callback(err, \'a value\').`
);

test.cb('Synchronous usage', callbackCalledWithMoreThanOneValueMacro, async (t, myCli)=>{
	t.plan(6);

	try{
		await myCli(['command-1']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('command-1', 'value-two'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	try{
		await myCli(['command-2']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('command-2', 'value-two, value-three'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	t.end();
});

test.cb('Callback usage', callbackCalledWithMoreThanOneValueMacro, (t, myCli)=>{
	t.plan(6);

	myCli(['command-1'], err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('command-1', 'value-two'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	myCli(['command-2'], err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('command-2', 'value-two, value-three'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	function endTest() {
		endTest.callCount++;
		if (endTest.callCount === 2) {
			t.end();
		}
	}
	endTest.callCount = 0;
});

test.cb('Promise usage', callbackCalledWithMoreThanOneValueMacro, (t, myCli)=>{
	t.plan(6);

	myCli(['command-1']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('command-1', 'value-two'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	myCli(['command-2']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('command-2', 'value-two, value-three'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	function endTest() {
		endTest.callCount++;
		if (endTest.callCount === 2) {
			t.end();
		}
	}
	endTest.callCount = 0;
});

/*------------------------------*/

function callbackCalledWithUnvalidErrorMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const glob = pathFromIndex('tests/mocks/mock-commands/from-glob/callback-called-with-an-unvalid-error/*.js');

	const myCli = cleanquirer({
		name: 'cli-unvalid-error',
		commands: [
			glob
		]
	});

	core(t, myCli);
}

callbackCalledWithUnvalidErrorMacro.title = providedTitle => (
	`Action with a callback called with an unvalid error - ${providedTitle}`);

const callbackCalledWithUnvalidErrorErrorMessage = (command, unvalidError) => msg(
	`The cli-unvalid-error command "${command}" you are trying to use`,
	`calls internally a callback with a unvalid error value: (${typeof unvalidError}) ${unvalidError}.`,
	`If the command uses a callback, the error parameter at first position`,
	`can only be null or undefined if no error, or an instance of Error, like this:`,
	`callback(new Error("An error message")). If the command is supposed`,
	`to call the callback with a value, it must use the second argument like this: callback(null, 'command result')`
);

test.cb('Synchronous usage', callbackCalledWithUnvalidErrorMacro, async (t, myCli)=>{
	t.plan(6);

	try{
		await myCli(['command-1']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithUnvalidErrorErrorMessage('command-1', 2));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	try{
		await myCli(['command-2']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithUnvalidErrorErrorMessage('command-2', false));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	t.end();
});

test.cb('Callback usage', callbackCalledWithUnvalidErrorMacro, (t, myCli)=>{
	t.plan(6);

	myCli(['command-1'], err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithUnvalidErrorErrorMessage('command-1', 2));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	myCli(['command-2'], err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithUnvalidErrorErrorMessage('command-2', false));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	function endTest() {
		endTest.callCount++;
		if (endTest.callCount === 2) {
			t.end();
		}
	}
	endTest.callCount = 0;
});

test.cb('Promise usage', callbackCalledWithUnvalidErrorMacro, (t, myCli)=>{
	t.plan(6);

	myCli(['command-1']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithUnvalidErrorErrorMessage('command-1', 2));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	myCli(['command-2']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithUnvalidErrorErrorMessage('command-2', false));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		endTest();
	});

	function endTest() {
		endTest.callCount++;
		if (endTest.callCount === 2) {
			t.end();
		}
	}
	endTest.callCount = 0;
});

/*-----------------------*/

test.cb('Action with callback and returning a value', t => {
	t.plan(6);

	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-test',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/action-with-callback-and-returning-a-value/*.js')
		]
	});

	function testEnd() {
		testEnd.callCount++;
		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	myCli(['command-1']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, msg(
			`The cli-test command "command-1" you are trying to use both uses internally`,
			`a callback and returns a value (42) of type number. This is not permitted by cleanquirer.`,
			`If the command uses a callback, it must not return a value. Eventually, it can pass that`,
			`value as the second parameter of the callback like this: callback(null, resultValue)`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		testEnd();
	});

	myCli(['command-2']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, msg(
			`The cli-test command "command-2" you are trying to use both uses internally`,
			`a callback and returns a value (false) of type boolean. This is not permitted by cleanquirer.`,
			`If the command uses a callback, it must not return a value. Eventually, it can pass that`,
			`value as the second parameter of the callback like this: callback(null, resultValue)`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		testEnd();
	});
});