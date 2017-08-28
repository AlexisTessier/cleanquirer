'use strict';

const test = require('ava');

const path = require('path');

const pathFromIndex = require('../utils/path-from-index');
const requireFromIndex = require('../utils/require-from-index');
const mockFunction = require('../mocks/mock-function');
const mockCommandFile = require('../mocks/mock-command-file');

test('type and basic api', t => {
	const cleanquirerFromIndex = requireFromIndex('index');
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.is(cleanquirerFromIndex, cleanquirer);
	t.is(typeof cleanquirer, 'function');

	const myCli = cleanquirer({
		name: 'mycli'
	});

	t.is(typeof myCli, 'function');
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function unvalidConfigMacro(t, unvalidConfig) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidConfigError = t.throws(()=>{
		cleanquirer(unvalidConfig);
	});

	if (unvalidConfig !== null) {
		t.is(unvalidConfigError.message, `You must provide a valid configuration object to cleanquirer. ${typeof unvalidConfig} is not a valid type for a cleanquirer configuration.`);
	}
}

unvalidConfigMacro.title = (providedTitle, conf) => (
	`${providedTitle} - need a valid config like ${typeof conf} - ${typeof conf === 'object' ? JSON.stringify(conf) : typeof conf}`);

test(unvalidConfigMacro);
test(unvalidConfigMacro, undefined);
test(unvalidConfigMacro, []);
test(unvalidConfigMacro, 2);
test(unvalidConfigMacro, true);
test(unvalidConfigMacro, false);
test(unvalidConfigMacro, null);
test(unvalidConfigMacro, 'unvalid');
test(unvalidConfigMacro, '  ');
test(unvalidConfigMacro, function () {});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function noNameParameterMacro(t, configWithNoName) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const noValidNameError = t.throws(()=>{
		cleanquirer(configWithNoName);
	});

	t.is(noValidNameError.message, `You must provide a not empty string as valid name parameter for your cli tool.`);
}

noNameParameterMacro.title = (providedTitle, data) => (
	`${providedTitle} - need a name parameter or throw an error with config like ${JSON.stringify(data)}`);

test(noNameParameterMacro, {});
test(noNameParameterMacro, {name: '  '});
test(noNameParameterMacro, {name: ''});
test(noNameParameterMacro, {noname: ''});
test(noNameParameterMacro, {name: true});
test(noNameParameterMacro, {name: false});
test(noNameParameterMacro, {name: {}});
test(noNameParameterMacro, {name: []});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function synchronousCommandFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command',
				action(){
					actionFunction();
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

synchronousCommandFromSimpleCommandObjectMacro.title = providedTitle => (
	`Synchronous command from a simple command object - ${providedTitle}`);

test('Synchronous usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	cli(['command']);

	t.true(action.calledOnce);
});

test.cb('Callback usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(2);

	cli(['command'], err => {
		t.is(err, null);

		t.true(action.calledOnce);

		t.end();
	});
});

test('Promise usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(2);

	const cliPromise = cli(['command']);

	t.true(cliPromise instanceof Promise);

	return cliPromise.then(() => {
		t.true(action.calledOnce);
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function commandFromFileMacro(t, type, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const [template, skipExtension] = Array.isArray(type) ? type : [type, false];

	mockCommandFile(template).then(filepath => {
		const actionFunction = require(skipExtension === 'skipExtension' ? (
			path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)))
		): filepath);

		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				filepath
			]
		});

		core(t, myCli, actionFunction);
	});
}

commandFromFileMacro.title = providedTitle => (
	`Command from a file - ${providedTitle}`);

test.cb('return promise', commandFromFileMacro, 'no-doc.js', (t, myCli) => {
	const commandPromise = myCli(['no-doc']);

	t.true(commandPromise instanceof Promise);

	t.end();
});

test.cb('return promise skipping the file extension', commandFromFileMacro, ['no-doc.js', 'skipExtension'], (t, myCli) => {
	const commandPromise = myCli(['no-doc']);

	t.true(commandPromise instanceof Promise);

	t.end();
});

/*---------------------------*/

function commandFromFileSynchronousUsageCore(command) {
	return (t, myCli, actionFunction) => {
		myCli([command]);

		t.is(actionFunction.callCount, 0);
		t.end();
	}
}

function commandFromFileCallbackUsageCore(command) {
	return (t, myCli, actionFunction) => {
		t.plan(3);

		myCli([command], err => {
			t.is(err, null);
			t.is(actionFunction.callCount, 1);
			t.end();
		});

		t.is(actionFunction.callCount, 0);
	}
}

function commandFromFilePromiseUsageCore(command) {
	return (t, myCli, actionFunction) => {
		t.plan(3);

		const cliPromise = myCli([command]);

		t.true(cliPromise instanceof Promise);

		cliPromise.then(()=>{
			t.is(actionFunction.callCount, 1);
			t.end();
		});

		t.is(actionFunction.callCount, 0);
	}
}


/*---------------------------*/

function commandFromUndocumentedFileMacro(t, core) {
	return commandFromFileMacro(t, 'no-doc.js', core);
}

commandFromUndocumentedFileMacro.title = providedTitle => (
	`Command from an undocumented file - ${providedTitle}`);

test.cb('Synchronous usage', commandFromUndocumentedFileMacro, commandFromFileSynchronousUsageCore('no-doc'));
test.cb('Callback usage', commandFromUndocumentedFileMacro, commandFromFileCallbackUsageCore('no-doc'));
test.cb('Promise usage', commandFromUndocumentedFileMacro, commandFromFilePromiseUsageCore('no-doc'));

/*---------------------------*/

function commandFromFileWithEmptyCommentMacro(t, core) {
	return commandFromFileMacro(t, 'empty-comment-doc.js', core);
}

commandFromFileWithEmptyCommentMacro.title = providedTitle => (
	`Command from a file with empty comment - ${providedTitle}`);

test.cb('Synchronous usage', commandFromFileWithEmptyCommentMacro, commandFromFileSynchronousUsageCore('empty-comment-doc'));
test.cb('Callback usage', commandFromFileWithEmptyCommentMacro, commandFromFileCallbackUsageCore('empty-comment-doc'));
test.cb('Promise usage', commandFromFileWithEmptyCommentMacro, commandFromFilePromiseUsageCore('empty-comment-doc'));

/*---------------------------*/

function commandFromFileWithDocMacro(t, core) {
	return commandFromFileMacro(t, 'doc.js', core);
}

commandFromFileWithDocMacro.title = providedTitle => (
	`Command from a file with comment - ${providedTitle}`);

test.cb('Synchronous usage', commandFromFileWithDocMacro, commandFromFileSynchronousUsageCore('doc-name'));
test.cb('Callback usage', commandFromFileWithDocMacro, commandFromFileCallbackUsageCore('doc-name'));
test.cb('Promise usage', commandFromFileWithDocMacro, commandFromFilePromiseUsageCore('doc-name'));

/*---------------------------*/

function commandFromFileWithMultipleCommentsMacro(t, core) {
	return commandFromFileMacro(t, 'multi-comments.js', core);
}

commandFromFileWithMultipleCommentsMacro.title = providedTitle => (
	`Command from a file with multiple comments - ${providedTitle}`);

test.cb('Synchronous usage', commandFromFileWithMultipleCommentsMacro, commandFromFileSynchronousUsageCore('multi-comments-name'));
test.cb('Callback usage', commandFromFileWithMultipleCommentsMacro, commandFromFileCallbackUsageCore('multi-comments-name'));
test.cb('Promise usage', commandFromFileWithMultipleCommentsMacro, commandFromFilePromiseUsageCore('multi-comments-name'));

/*---------------------------*/

function commandFromUndocumentedFileWithMultipleFunctionsMacro(t, core) {
	return commandFromFileMacro(t, 'multi-functions-file-no-doc.js', core);
}

commandFromUndocumentedFileWithMultipleFunctionsMacro.title = providedTitle => (
	`Command from an undocumented file with multiple functions - ${providedTitle}`);

test.cb('Synchronous usage', commandFromUndocumentedFileWithMultipleFunctionsMacro, commandFromFileSynchronousUsageCore('multi-functions-file-no-doc'));
test.cb('Callback usage', commandFromUndocumentedFileWithMultipleFunctionsMacro, commandFromFileCallbackUsageCore('multi-functions-file-no-doc'));
test.cb('Promise usage', commandFromUndocumentedFileWithMultipleFunctionsMacro, commandFromFilePromiseUsageCore('multi-functions-file-no-doc'));

/*---------------------------*/

function commandFromFileWithMultipleFunctionAndSomeCommentsMacro(t, core) {
	return commandFromFileMacro(t, 'multi-functions-file-no-doc-mixed.js', core);
}

commandFromFileWithMultipleFunctionAndSomeCommentsMacro.title = providedTitle => (
	`Command from a file with multiple functions and some comments - ${providedTitle}`);

test.cb('Synchronous usage', commandFromFileWithMultipleFunctionAndSomeCommentsMacro, commandFromFileSynchronousUsageCore('multi-functions-file-no-doc-mixed'));
test.cb('Callback usage', commandFromFileWithMultipleFunctionAndSomeCommentsMacro, commandFromFileCallbackUsageCore('multi-functions-file-no-doc-mixed'));
test.cb('Promise usage', commandFromFileWithMultipleFunctionAndSomeCommentsMacro, commandFromFilePromiseUsageCore('multi-functions-file-no-doc-mixed'));

/*---------------------------*/

function commandFromFileWithMultipleFunctionMacro(t, core) {
	return commandFromFileMacro(t, 'multi-functions-file.js', core);
}

commandFromFileWithMultipleFunctionMacro.title = providedTitle => (
	`Command from a file with multiple functions - ${providedTitle}`);

test.cb('Synchronous usage', commandFromFileWithMultipleFunctionMacro, commandFromFileSynchronousUsageCore('main-doc-name'));
test.cb('Callback usage', commandFromFileWithMultipleFunctionMacro, commandFromFileCallbackUsageCore('main-doc-name'));
test.cb('Promise usage', commandFromFileWithMultipleFunctionMacro, commandFromFilePromiseUsageCore('main-doc-name'));

/*---------------------------*/

test.cb.todo('Command from documented command files synchronously throwing error');
test.cb.todo('Command from documented command files synchronously calling the callback with an error');
test.cb.todo('Command from documented command files asynchronously calling the callback with an error');
test.cb.todo('Command from documented command files resolving an error');
test.todo('Wrong cli input when defining commands from files');

/*---------------------------*/

test.todo('Error using a wrong filepath defining a command from file');
test.todo('Error using a no function module defining a command from file');
test.todo('Error using a no js file defining a command from file');
test.todo('Error using a no js file defining a command from file - skipping extension');
test.todo('Error using a file which contains a syntax error when defining a command from file');
test.todo('Error using an unhandled exports definition defining a command from file');
test.todo('Error using an unhandled exports type defining a command from file');
test.todo('Error using an unhandled exports origin defining a command from file');
/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function synchronousCommandThrowingErrorFromSimpleCommandObjectMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'errormycli',
		commands: [
			{
				name: 'error-command',
				action(){
					throw new Error('error command error');
				}
			}
		]
	});

	const error = t.throws(()=>{
		core(t, myCli);
	});

	t.is(error.message, `Error happen when using the errormycli command "error-command" : error command error`);
}

synchronousCommandThrowingErrorFromSimpleCommandObjectMacro.title = providedTitle => (
	`Synchronous command throwing an error from a simple command object - ${providedTitle}`)

test('Synchronous usage', synchronousCommandThrowingErrorFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['error-command'])
});

test('Callback usage', synchronousCommandThrowingErrorFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['error-command'], err => {
		t.fail();
	})
});

test('Promise usage', synchronousCommandThrowingErrorFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['error-command']).then(()=>{
		t.fail();
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function asynchronousCommandCallbackFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback-command',
				action(options, done){
					setTimeout(()=>{
						actionFunction();
						done();
					}, t.context.asyncTimeout);
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandCallbackFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous callback command from simple command object - ${providedTitle}`);

test.cb('Synchronous usage', asynchronousCommandCallbackFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['callback-command']);

	t.true(action.notCalled);

	setTimeout(()=>{
		t.true(action.calledOnce);

		t.end();
	}, t.context.asyncTimeout*2);
});

test.cb('Callback usage', asynchronousCommandCallbackFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(2);

	cli(['callback-command'], () => {
		t.true(action.calledOnce);
		t.end();
	});

	t.true(action.notCalled);
});

test('Promise usage', asynchronousCommandCallbackFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(3);

	const cliPromise = cli(['callback-command']);

	t.true(cliPromise instanceof Promise);
	t.true(action.notCalled);

	return cliPromise.then(()=>{
		t.true(action.calledOnce);
	});
});


/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback-command',
				action(options, done){
					setTimeout(()=>{
						actionFunction();
						done(new Error('callback error'));
						actionFunction();
					}, t.context.asyncTimeout);
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous callback command with error from simple command object - ${providedTitle}`);

test.cb('Synchronous usage', asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['callback-command']).then(()=>{}).catch(()=>{});

	t.true(action.notCalled);

	setTimeout(()=>{
		t.true(action.calledTwice);

		t.end();
	}, t.context.asyncTimeout*2);
});

test.cb('Callback usage', asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(6);

	cli(['callback-command'], err => {
		t.true(action.calledOnce);

		t.true(err instanceof Error);
		t.is(err.message, `mycli callback-command error: callback error`);
	});

	t.true(action.notCalled);

	setTimeout(()=>{
		t.true(action.calledTwice);

		t.end();
	}, t.context.asyncTimeout*2);
});

test('Promise usage', asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(6);

	const cliPromise = cli(['callback-command']);
	
	t.true(cliPromise instanceof Promise);
	t.true(action.notCalled);

	return cliPromise.then(()=>{t.fail()}).catch(err => {
		t.true(action.calledTwice);

		t.true(err instanceof Error);
		t.is(err.message, `mycli callback-command error: callback error`);
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function asynchronousCommandPromiseFromSimpleCommandObjectMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'promise-command',
				action(){
					actionFunction();

					return new Promise(resolve => {
						actionFunction();
						setTimeout(()=>{
							actionFunction();
							resolve();
							actionFunction();
						}, t.context.asyncTimeout);
					});
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandPromiseFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous promise command from simple command object - ${providedTitle}`);

test.cb('Synchronous usage', asynchronousCommandPromiseFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['promise-command']);

	t.true(action.calledTwice);

	setTimeout(()=>{
		t.is(action.callCount, 4);

		t.end();
	}, t.context.asyncTimeout*2);
});

test.cb('Callback usage', asynchronousCommandPromiseFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(4);

	cli(['promise-command'], ()=>{
		t.is(action.callCount, 4);
	});

	t.true(action.calledTwice);

	setTimeout(()=>{
		t.is(action.callCount, 4);

		t.end();
	}, t.context.asyncTimeout*2);
});

test('Promise usage', asynchronousCommandPromiseFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(3);

	const cliPromise = cli(['promise-command']);

	t.true(cliPromise instanceof Promise);

	t.true(action.calledTwice);

	return cliPromise.then(()=>{
		t.is(action.callCount, 4);
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'myerrorcli',
		commands: [
			{
				name: 'promise-error-command',
				action(){
					actionFunction();

					return new Promise((resolve, reject) => {
						actionFunction();
						setTimeout(()=>{
							actionFunction();
							reject(new Error(`promise command rejected error`));
							actionFunction();
						}, t.context.asyncTimeout);
					});
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous promise command with rejection from simple command object - ${providedTitle}`);

test.cb('Synchronous usage', asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['promise-error-command']).then(()=>{}).catch(()=>{});

	t.true(action.calledTwice);

	setTimeout(()=>{
		t.is(action.callCount, 4);

		t.end();
	}, t.context.asyncTimeout*2);	
});

test.cb('Callback usage', asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(4);

	cli(['promise-error-command'], err => {
		t.is(action.callCount, 4);

		t.true(err instanceof Error);
		t.is(err.message, 'myerrorcli promise-error-command error: promise command rejected error');

		t.end();
	});

	t.true(action.calledTwice);
});

test('Promise usage', asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(5);

	const cliPromise = cli(['promise-error-command']);

	t.true(cliPromise instanceof Promise);

	t.true(action.calledTwice);

	return cliPromise.then(()=>t.fail()).catch(err => {
		t.is(action.callCount, 4);

		t.true(err instanceof Error);
		t.is(err.message, 'myerrorcli promise-error-command error: promise command rejected error');
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback',
				action(options, done){
					done();
				}
			}
		]
	});

	const useCallbackInSynchronousWayError = t.throws(()=>{
		core(t, myCli);
	});

	t.is(useCallbackInSynchronousWayError.message, 
		`The mycli command "callback" you are trying to use calls internally a callback in a synchronous way. This is not permitted by cleanquirer. If the command is synchronous, it shouldn't use neither callback or promise.`
	);
}

ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro.title = providedTitle => (
	`Throw error when using a synchronous callback command from a simple command object - ${providedTitle}`);

test('Synchronous usage', ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['callback']);
});

test('Callback usage', ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(3);

	cli(['callback'], err => {
		t.pass();
	});	
});

test('Promise usage', ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(2);

	cli(['callback']).then(()=>{
		t.fail();
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'myclii',
		commands: [
			{
				name: 'callback-promise',
				action(options, done){
					return new Promise((resolve, reject) => {
						resolve();
					});
				}
			}
		]
	});

	const useCallbackAndPromiseError = t.throws(()=>{
		core(t, myCli);
	});

	t.is(useCallbackAndPromiseError.message, 
		`The myclii command "callback-promise" you are trying to use both uses internally a callback and returns a promise. This is not permitted by cleanquirer. If the command is asynchronous, it must use callback or promise but not both.`);
}

ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro.title = providedTitle => (
	`Throw error when using a both callback and promise command from a simple command object - ${providedTitle}`);

test('Synchronous usage', ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['callback-promise']);
});

test('Callback usage', ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(2);

	cli(['callback-promise'], err => {
		t.fail();
	});
});

test('Promise usage', ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(2);

	cli(['callback-promise']).then(()=>{
		t.fail();
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function wrongCliInputMacro(t, wrongInput) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli'
	});

	const wrongCliInputError = t.throws(()=>{
		myCli(wrongInput);
	});

	t.is(wrongCliInputError.message, `When using mycli as a function, you must provide an input to it as an Array like one from process.argv.slice(2).`);
}

wrongCliInputMacro.title = (providedTitle, input) => (
	`${providedTitle} - throws error if provided input is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`)

test(wrongCliInputMacro);
test(wrongCliInputMacro, undefined);
test(wrongCliInputMacro, {});
test(wrongCliInputMacro, 2);
test(wrongCliInputMacro, true);
test(wrongCliInputMacro, false);
test(wrongCliInputMacro, null);
test(wrongCliInputMacro, '  ');
test(wrongCliInputMacro, 'wrong input');
test(wrongCliInputMacro, function () {});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.todo('Multiple commands definition from objects');
test.todo('Multiple commands definition from files');

test.todo('Command definition from glob');
test.todo('Command definition from no-matching glob');
test.todo('Multiple commands definition from glob');

test.todo('Multiple commands definition from files and objects');
test.todo('Multiple commands definition from files and globs');
test.todo('Multiple commands definition from files, globs and objects');
test.todo('Multiple commands definition from globs and objects');

test.todo('undefined command handling');
test.todo('version option');
test.todo('version command');

