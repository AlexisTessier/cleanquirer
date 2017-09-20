'use strict';

const test = require('ava');

const fs = require('fs');

const pathFromIndex = require('../utils/path-from-index');

function featureHasTestFileMacro(t, testFilename) {
	return new Promise(resolve => {
		fs.access(path.join(__dirname, 'cleanquirer', `${testFilename}.test.js`), err => {
			if (err) {t.fail(`The feature should be tested in a specific file. "${testFilename}" wasn't found (${err.message})`);}
			resolve();
		});
	});
}

featureHasTestFileMacro.title = providedTitle => (
	`Feature has a test file - ${providedTitle}`)

test('Basic usage', featureHasTestFileMacro, 'basic-usage');
test('Basic usage > errors handling', featureHasTestFileMacro, 'basic-usage-errors-handling');

test('Command from file', featureHasTestFileMacro, 'command-from-file');
test('Command from file > errors handling', featureHasTestFileMacro, 'command-from-file-errors-handling');

/*---------------------------*/

test('Use a command from object multiple times', t => {
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

	t.true(actionFunction.notCalled);

	myCli(['command']);
	t.true(actionFunction.calledOnce);

	myCli(['command']);
	t.true(actionFunction.calledTwice);

	myCli(['command']);
	t.true(actionFunction.calledThrice);

});

test('Multiple commands definition from objects', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction_1 = mockFunction();
	const actionFunction_2 = mockFunction();
	const actionFunction_3 = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'one',
				action(){
					actionFunction_1();
				}
			},
			{
				name: 'two',
				action(){
					actionFunction_2();
				}
			},
			{
				name: 'three',
				action(){
					actionFunction_3();
				}
			}
		]
	});

	t.true(actionFunction_1.notCalled);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['one']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['two']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.notCalled);

	myCli(['three']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.calledOnce);
});

test('Use commands from objects multiple times', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction_1 = mockFunction();
	const actionFunction_2 = mockFunction();
	const actionFunction_3 = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'one',
				action(){
					actionFunction_1();
				}
			},
			{
				name: 'two',
				action(){
					actionFunction_2();
				}
			},
			{
				name: 'three',
				action(){
					actionFunction_3();
				}
			}
		]
	});

	t.true(actionFunction_1.notCalled);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['one']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['two']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.notCalled);

	myCli(['three']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.calledOnce);

	myCli(['one']);
	t.true(actionFunction_1.calledTwice);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.calledOnce);

	myCli(['two']);
	t.true(actionFunction_1.calledTwice);
	t.true(actionFunction_2.calledTwice);
	t.true(actionFunction_3.calledOnce);

	myCli(['three']);
	t.true(actionFunction_1.calledTwice);
	t.true(actionFunction_2.calledTwice);
	t.true(actionFunction_3.calledTwice);

	myCli(['one']);
	t.true(actionFunction_1.calledThrice);
	t.true(actionFunction_2.calledTwice);
	t.true(actionFunction_3.calledTwice);

	myCli(['two']);
	t.true(actionFunction_1.calledThrice);
	t.true(actionFunction_2.calledThrice);
	t.true(actionFunction_3.calledTwice);

	myCli(['three']);
	t.true(actionFunction_1.calledThrice);
	t.true(actionFunction_2.calledThrice);
	t.true(actionFunction_3.calledThrice);
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.cb('Use a command from file multiple times', commandFromFileMacro, 'no-doc.js', async (t, myCli, actionFunction) => {
	t.is(actionFunction.callCount, 0);
	
	await myCli(['no-doc']);
	
	t.is(actionFunction.callCount, 1);

	await myCli(['no-doc']);

	t.is(actionFunction.callCount, 2);

	await myCli(['no-doc']);

	t.is(actionFunction.callCount, 3);

	t.end();
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

async function multipleCommandsDefinitionsFromFilesMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const commands = [];

	await Promise.all([
		mockCommandFile('no-doc.js').then(filename => commands[0] = filename),
		mockCommandFile('doc.js').then(filename => commands[1] = filename),
		mockCommandFile('multi-functions-file.js').then(filename => commands[2] = filename)
	]);

	const [
		noDocActionFunction, docActionFunction, multiFunctionsActionFunction
	] = commands.map(filename => require(filename));

	const myCli = cleanquirer({
		name: 'mycli',
		commands
	});

	await core(t, myCli, {
		first: ['no-doc'],
		second: ['doc-name'],
		third: ['main-doc-name']
	}, {
		first: noDocActionFunction,
		second: docActionFunction,
		third: multiFunctionsActionFunction
	});
}

multipleCommandsDefinitionsFromFilesMacro.title = providedTitle => (
	`${providedTitle} - Multiple commands definition from files`);


test(multipleCommandsDefinitionsFromFilesMacro, async (t, myCli, actionCommands, actionFunctions) => {
	t.is(actionFunctions.first.callCount, 0);
	t.is(actionFunctions.second.callCount, 0);
	t.is(actionFunctions.third.callCount, 0);

	await myCli(actionCommands.first);
	t.is(actionFunctions.first.callCount, 1);
	t.is(actionFunctions.second.callCount, 0);
	t.is(actionFunctions.third.callCount, 0);

	await myCli(actionCommands.second);
	t.is(actionFunctions.first.callCount, 1);
	t.is(actionFunctions.second.callCount, 1);
	t.is(actionFunctions.third.callCount, 0);

	await myCli(actionCommands.third);
	t.is(actionFunctions.first.callCount, 1);
	t.is(actionFunctions.second.callCount, 1);
	t.is(actionFunctions.third.callCount, 1);
});

test(`shouldn't modify the input Array when using commands from files`, multipleCommandsDefinitionsFromFilesMacro, async (t, myCli, actionCommands, actionFunctions) => {
	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);

	await myCli(actionCommands.first);

	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);

	await myCli(actionCommands.second);

	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);

	await myCli(actionCommands.third);

	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);

	await myCli(actionCommands.first);

	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);

	await myCli(actionCommands.second);

	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);

	await myCli(actionCommands.third);

	t.is(actionCommands.first.length, 1);
	t.is(actionCommands.second.length, 1);
	t.is(actionCommands.third.length, 1);
});

test('Use commands from files multiple times', multipleCommandsDefinitionsFromFilesMacro, async (t, myCli, actionCommands, actionFunctions) => {
	t.is(actionFunctions.first.callCount, 0);
	t.is(actionFunctions.second.callCount, 0);
	t.is(actionFunctions.third.callCount, 0);

	await myCli(actionCommands.first);
	t.is(actionFunctions.first.callCount, 1);
	t.is(actionFunctions.second.callCount, 0);
	t.is(actionFunctions.third.callCount, 0);

	await myCli(actionCommands.second);
	t.is(actionFunctions.first.callCount, 1);
	t.is(actionFunctions.second.callCount, 1);
	t.is(actionFunctions.third.callCount, 0);

	await myCli(actionCommands.third);
	t.is(actionFunctions.first.callCount, 1);
	t.is(actionFunctions.second.callCount, 1);
	t.is(actionFunctions.third.callCount, 1);

	await myCli(actionCommands.first);
	t.is(actionFunctions.first.callCount, 2);
	t.is(actionFunctions.second.callCount, 1);
	t.is(actionFunctions.third.callCount, 1);

	await myCli(actionCommands.second);
	t.is(actionFunctions.first.callCount, 2);
	t.is(actionFunctions.second.callCount, 2);
	t.is(actionFunctions.third.callCount, 1);

	await myCli(actionCommands.third);
	t.is(actionFunctions.first.callCount, 2);
	t.is(actionFunctions.second.callCount, 2);
	t.is(actionFunctions.third.callCount, 2);

	await myCli(actionCommands.first);
	t.is(actionFunctions.first.callCount, 3);
	t.is(actionFunctions.second.callCount, 2);
	t.is(actionFunctions.third.callCount, 2);

	await myCli(actionCommands.second);
	t.is(actionFunctions.first.callCount, 3);
	t.is(actionFunctions.second.callCount, 3);
	t.is(actionFunctions.third.callCount, 2);

	await myCli(actionCommands.third);
	t.is(actionFunctions.first.callCount, 3);
	t.is(actionFunctions.second.callCount, 3);
	t.is(actionFunctions.third.callCount, 3);
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test('Command definition from glob', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/one-match');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-doc/*.js')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['one-match-command']);

	t.is(actionFunction.callCount, 1);
});

test.todo('Command definition from glob with no doc');

test.todo('Command definition from glob mixed doc an no-doc');

test.todo('Command definition from no-matching glob');

test.todo('Command definition from extensionless glob');

test.todo('Use a command from glob multiple times');

test.todo('Multiple commands definition from glob');
test.todo('Use commands from globs multiple times');

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.todo('Multiple commands definition from files and objects');
test.todo('Use commands from files and objects multiple times');

test.todo('Multiple commands definition from files and globs');
test.todo('Use commands from files and globs multiple times');

test.todo('Multiple commands definition from files, globs and objects');
test.todo('Use commands from files, globs and objects multiple times');

test.todo('Multiple commands definition from globs and objects');
test.todo('Use commands from globs and objects multiple times');

test.todo('Check the execution order of multiple commands defined from objects');
test.todo('Check the execution order of multiple commands defined from files');
test.todo('Check the execution order of multiple commands defined from globs');

test.todo('Check the execution order of multiple commands defined from files and objects');
test.todo('Check the execution order of multiple commands defined from files and globs');
test.todo('Check the execution order of multiple commands defined from files, globs and objects');
test.todo('Check the execution order of multiple commands defined from globs and objects');

test.todo('Check the execution order of multiple commands defined from objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from globs with multiple uses of commands');

test.todo('Check the execution order of multiple commands defined from files and objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files and globs with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files, globs and objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from globs and objects with multiple uses of commands');

test.todo('undefined command handling');
test.todo('version option');
test.todo('version command');