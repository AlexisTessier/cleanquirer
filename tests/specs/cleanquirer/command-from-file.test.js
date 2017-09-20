'use strict';

const test = require('ava');

const path = require('path');

const requireFromIndex = require('../../utils/require-from-index');

const mockCommandFile = require('../../mocks/mock-command-file');

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