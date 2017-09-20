'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

const mockCommandFile = require('../../mocks/mock-command-file');

const commandFromFileMacro = require('./command-from-file.macro');

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

/*---------------------------*/

function commandFromFileWithEmptyCommentMacro(t, core) {
	return commandFromFileMacro(t, 'empty-comment-doc.js', core);
}

commandFromFileWithEmptyCommentMacro.title = providedTitle => (
	`Command from a file with empty comment - ${providedTitle}`);

/*---------------------------*/

function commandFromFileWithDocMacro(t, core) {
	return commandFromFileMacro(t, 'doc.js', core);
}

commandFromFileWithDocMacro.title = providedTitle => (
	`Command from a file with comment - ${providedTitle}`);

/*---------------------------*/

function commandFromFileWithMultipleCommentsMacro(t, core) {
	return commandFromFileMacro(t, 'multi-comments.js', core);
}

commandFromFileWithMultipleCommentsMacro.title = providedTitle => (
	`Command from a file with multiple comments - ${providedTitle}`);

/*---------------------------*/

function commandFromUndocumentedFileWithMultipleFunctionsMacro(t, core) {
	return commandFromFileMacro(t, 'multi-functions-file-no-doc.js', core);
}

commandFromUndocumentedFileWithMultipleFunctionsMacro.title = providedTitle => (
	`Command from an undocumented file with multiple functions - ${providedTitle}`);

/*---------------------------*/

function commandFromFileWithMultipleFunctionAndSomeCommentsMacro(t, core) {
	return commandFromFileMacro(t, 'multi-functions-file-no-doc-mixed.js', core);
}

commandFromFileWithMultipleFunctionAndSomeCommentsMacro.title = providedTitle => (
	`Command from a file with multiple functions and some comments - ${providedTitle}`);

/*---------------------------*/

function commandFromFileWithMultipleFunctionMacro(t, core) {
	return commandFromFileMacro(t, 'multi-functions-file.js', core);
}

commandFromFileWithMultipleFunctionMacro.title = providedTitle => (
	`Command from a file with multiple functions - ${providedTitle}`);

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

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

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

test.cb('Synchronous usage', commandFromUndocumentedFileMacro, commandFromFileSynchronousUsageCore('no-doc'));
test.cb('Callback usage', commandFromUndocumentedFileMacro, commandFromFileCallbackUsageCore('no-doc'));
test.cb('Promise usage', commandFromUndocumentedFileMacro, commandFromFilePromiseUsageCore('no-doc'));

/*---------------------------*/

test.cb('Synchronous usage', commandFromFileWithEmptyCommentMacro, commandFromFileSynchronousUsageCore('empty-comment-doc'));
test.cb('Callback usage', commandFromFileWithEmptyCommentMacro, commandFromFileCallbackUsageCore('empty-comment-doc'));
test.cb('Promise usage', commandFromFileWithEmptyCommentMacro, commandFromFilePromiseUsageCore('empty-comment-doc'));

/*---------------------------*/

test.cb('Synchronous usage', commandFromFileWithDocMacro, commandFromFileSynchronousUsageCore('doc-name'));
test.cb('Callback usage', commandFromFileWithDocMacro, commandFromFileCallbackUsageCore('doc-name'));
test.cb('Promise usage', commandFromFileWithDocMacro, commandFromFilePromiseUsageCore('doc-name'));

/*---------------------------*/

test.cb('Synchronous usage', commandFromFileWithMultipleCommentsMacro, commandFromFileSynchronousUsageCore('multi-comments-name'));
test.cb('Callback usage', commandFromFileWithMultipleCommentsMacro, commandFromFileCallbackUsageCore('multi-comments-name'));
test.cb('Promise usage', commandFromFileWithMultipleCommentsMacro, commandFromFilePromiseUsageCore('multi-comments-name'));

/*---------------------------*/

test.cb('Synchronous usage', commandFromUndocumentedFileWithMultipleFunctionsMacro, commandFromFileSynchronousUsageCore('multi-functions-file-no-doc'));
test.cb('Callback usage', commandFromUndocumentedFileWithMultipleFunctionsMacro, commandFromFileCallbackUsageCore('multi-functions-file-no-doc'));
test.cb('Promise usage', commandFromUndocumentedFileWithMultipleFunctionsMacro, commandFromFilePromiseUsageCore('multi-functions-file-no-doc'));

/*---------------------------*/

test.cb('Synchronous usage', commandFromFileWithMultipleFunctionAndSomeCommentsMacro, commandFromFileSynchronousUsageCore('multi-functions-file-no-doc-mixed'));
test.cb('Callback usage', commandFromFileWithMultipleFunctionAndSomeCommentsMacro, commandFromFileCallbackUsageCore('multi-functions-file-no-doc-mixed'));
test.cb('Promise usage', commandFromFileWithMultipleFunctionAndSomeCommentsMacro, commandFromFilePromiseUsageCore('multi-functions-file-no-doc-mixed'));

/*---------------------------*/

test.cb('Synchronous usage', commandFromFileWithMultipleFunctionMacro, commandFromFileSynchronousUsageCore('main-doc-name'));
test.cb('Callback usage', commandFromFileWithMultipleFunctionMacro, commandFromFileCallbackUsageCore('main-doc-name'));
test.cb('Promise usage', commandFromFileWithMultipleFunctionMacro, commandFromFilePromiseUsageCore('main-doc-name'));

/*---------------------------*/

test.cb(`shouldn't modify the input Array when using command from file`, commandFromFileMacro, 'no-doc.js', async (t, myCli, actionFunction) => {
	const input = ['no-doc'];

	t.is(input.length, 1);
	
	await myCli(input);
	
	t.is(input.length, 1);

	t.end();
});

/*---------------------------*/

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

/*---------------------------*/

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