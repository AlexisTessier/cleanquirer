'use strict';

const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

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

test('Command definition from extensionless glob', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-extensionless-glob/one-match-doc/one-match');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-extensionless-glob/one-match-doc/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['from-extensionless-glob-one-match-command']);

	t.is(actionFunction.callCount, 1);
});

test('Command definition from glob targeting file without doc', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-no-doc/one-match');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-no-doc/*.js')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['one-match']);

	t.is(actionFunction.callCount, 1);
});

test('Command definition from glob mixed doc and no-doc', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunctionDoc = requireFromIndex('tests/mocks/mock-commands/from-glob/two-match-doc-and-no-doc/doc');
	const actionFunctionNoDoc = requireFromIndex('tests/mocks/mock-commands/from-glob/two-match-doc-and-no-doc/no-doc');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/two-match-doc-and-no-doc/*')
		]
	});

	t.is(actionFunctionDoc.callCount, 0);
	t.is(actionFunctionNoDoc.callCount, 0);

	await myCli(['two-match-doc-command']);

	t.is(actionFunctionDoc.callCount, 1);
	t.is(actionFunctionNoDoc.callCount, 0);

	await myCli(['no-doc']);

	t.is(actionFunctionDoc.callCount, 1);
	t.is(actionFunctionNoDoc.callCount, 1);
});

test('Command definition from glob with empty comment', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-empty-comment/glob-command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-empty-comment/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['glob-command']);

	t.is(actionFunction.callCount, 1);
});

test('Command definition from glob with multiple comments', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-comments/command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-comments/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['multi-comments-name']);

	t.is(actionFunction.callCount, 1);
});

test('Command definition from glob with multiple functions without comments', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-functions-without-comment/no-doc-command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-functions-without-comment/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['no-doc-command']);

	t.is(actionFunction.callCount, 1);
});

test('Command definition from glob with multiple functions and some comments', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-functions-and-some-comments/command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-functions-and-some-comments/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['command']);

	t.is(actionFunction.callCount, 1);
});

test('Command definition from glob with multiple functions', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-functions/command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/one-match-with-multiple-functions/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['main-doc-name']);

	t.is(actionFunction.callCount, 1);
});

test('Multiple commands definition from glob', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunctionFromRoot = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands/from-root');
	const actionFunctionFromSubfolder = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands/subfolder/from-subfolder');
	const actionFunctionFromSubfolderBis = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands/subfolder/from-subfolder-bis');
	const actionFunctionFromDeepSubfolder = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands/subfolder/deep-subfolder/command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands/**/*.js')
		]
	});

	t.is(actionFunctionFromRoot.callCount, 0);
	t.is(actionFunctionFromSubfolder.callCount, 0);
	t.is(actionFunctionFromSubfolderBis.callCount, 0);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-root-command']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 0);
	t.is(actionFunctionFromSubfolderBis.callCount, 0);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 0);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-subfolder-documented-command']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 1);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-deep-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 1);
	t.is(actionFunctionFromDeepSubfolder.callCount, 1);
});

test('Use a command from glob multiple times', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-uses/command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/multiple-uses/*')
		]
	});

	t.is(actionFunction.callCount, 0);

	await myCli(['multiple-use-command']);

	t.is(actionFunction.callCount, 1);

	await myCli(['multiple-use-command']);

	t.is(actionFunction.callCount, 2);

	await myCli(['multiple-use-command']);

	t.is(actionFunction.callCount, 3);
});

test('Use commands from globs multiple times', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunctionFromRoot = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands-multiple-uses/from-root');
	const actionFunctionFromSubfolder = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands-multiple-uses/subfolder/from-subfolder');
	const actionFunctionFromSubfolderBis = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands-multiple-uses/subfolder/from-subfolder-bis');
	const actionFunctionFromDeepSubfolder = requireFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands-multiple-uses/subfolder/deep-subfolder/command');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/multiple-commands-multiple-uses/**/*.js')
		]
	});

	t.is(actionFunctionFromRoot.callCount, 0);
	t.is(actionFunctionFromSubfolder.callCount, 0);
	t.is(actionFunctionFromSubfolderBis.callCount, 0);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-root-command']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 0);
	t.is(actionFunctionFromSubfolderBis.callCount, 0);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 0);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-subfolder-documented-command']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 1);
	t.is(actionFunctionFromDeepSubfolder.callCount, 0);

	await myCli(['from-deep-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 1);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 1);
	t.is(actionFunctionFromDeepSubfolder.callCount, 1);

	await myCli(['from-root-command']);

	t.is(actionFunctionFromRoot.callCount, 2);
	t.is(actionFunctionFromSubfolder.callCount, 1);
	t.is(actionFunctionFromSubfolderBis.callCount, 1);
	t.is(actionFunctionFromDeepSubfolder.callCount, 1);

	await myCli(['from-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 2);
	t.is(actionFunctionFromSubfolder.callCount, 2);
	t.is(actionFunctionFromSubfolderBis.callCount, 1);
	t.is(actionFunctionFromDeepSubfolder.callCount, 1);

	await myCli(['from-subfolder-documented-command']);

	t.is(actionFunctionFromRoot.callCount, 2);
	t.is(actionFunctionFromSubfolder.callCount, 2);
	t.is(actionFunctionFromSubfolderBis.callCount, 2);
	t.is(actionFunctionFromDeepSubfolder.callCount, 1);

	await myCli(['from-deep-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 2);
	t.is(actionFunctionFromSubfolder.callCount, 2);
	t.is(actionFunctionFromSubfolderBis.callCount, 2);
	t.is(actionFunctionFromDeepSubfolder.callCount, 2);

	await myCli(['from-root-command']);

	t.is(actionFunctionFromRoot.callCount, 3);
	t.is(actionFunctionFromSubfolder.callCount, 2);
	t.is(actionFunctionFromSubfolderBis.callCount, 2);
	t.is(actionFunctionFromDeepSubfolder.callCount, 2);

	await myCli(['from-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 3);
	t.is(actionFunctionFromSubfolder.callCount, 3);
	t.is(actionFunctionFromSubfolderBis.callCount, 2);
	t.is(actionFunctionFromDeepSubfolder.callCount, 2);

	await myCli(['from-subfolder-documented-command']);

	t.is(actionFunctionFromRoot.callCount, 3);
	t.is(actionFunctionFromSubfolder.callCount, 3);
	t.is(actionFunctionFromSubfolderBis.callCount, 3);
	t.is(actionFunctionFromDeepSubfolder.callCount, 2);

	await myCli(['from-deep-subfolder']);

	t.is(actionFunctionFromRoot.callCount, 3);
	t.is(actionFunctionFromSubfolder.callCount, 3);
	t.is(actionFunctionFromSubfolderBis.callCount, 3);
	t.is(actionFunctionFromDeepSubfolder.callCount, 3);
});

/*---------------------------*/

function actionReturningAValueMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-tool',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/action-returning-a-value/*.js')
		]
	});

	core(t, myCli);
}

actionReturningAValueMacro.title = providedTitle => (
	`Action returning a value - ${providedTitle}`
);

test.cb('Synchronous usage', actionReturningAValueMacro, async (t, myCli) => {
	let returnedValuePromise = myCli(['command-1']);
	t.true(returnedValuePromise instanceof Promise);

	let returnedValue = await returnedValuePromise;
	t.is(returnedValue, 'glob file 1 action returned value');

	returnedValuePromise = myCli(['command-2']);
	t.true(returnedValuePromise instanceof Promise);

	returnedValue = await returnedValuePromise;
	t.is(returnedValue, 'glob file 2 action returned value');

	t.end();
});

test.cb('Callback usage', actionReturningAValueMacro, (t, myCli) => {
	t.plan(6);

	function testEnd() {
		testEnd.callCount++;

		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	let returnedValueNotPromise = myCli(['command-1'], (err, result) => {
		t.is(err, null);

		t.is(result, 'glob file 1 action returned value');

		testEnd();
	});

	t.is(returnedValueNotPromise, null);

	returnedValueNotPromise = myCli(['command-2'], (err, result) => {
		t.is(err, null);

		t.is(result, 'glob file 2 action returned value');

		testEnd();
	});

	t.is(returnedValueNotPromise, null);
});

test.cb('Promise usage', actionReturningAValueMacro, (t, myCli) => {
	t.plan(4);

	function testEnd() {
		testEnd.callCount++;

		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	let returnedValuePromise = myCli(['command-1']);

	t.true(returnedValuePromise instanceof Promise);

	returnedValuePromise.then(result => {
		t.is(result, 'glob file 1 action returned value');

		testEnd();
	});

	returnedValuePromise = myCli(['command-2']);

	t.true(returnedValuePromise instanceof Promise);

	returnedValuePromise.then(result => {
		t.is(result, 'glob file 2 action returned value');

		testEnd();
	});
});

/*---------------------------*/

function actionWithACallbackCalledWithAValueMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-tool',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/action-with-a-callback-called-with-a-value/*.js')
		]
	});

	core(t, myCli);
}

actionWithACallbackCalledWithAValueMacro.title = providedTitle => (
	`Action with a callback called with a value - ${providedTitle}`
);

test.cb('Synchronous usage', actionWithACallbackCalledWithAValueMacro, async (t, myCli) => {
	let returnedValuePromise = myCli(['command-1']);
	t.true(returnedValuePromise instanceof Promise);

	let returnedValue = await returnedValuePromise;
	t.is(returnedValue, 'glob file 1 action value from callback');

	returnedValuePromise = myCli(['command-2']);
	t.true(returnedValuePromise instanceof Promise);

	returnedValue = await returnedValuePromise;
	t.is(returnedValue, 'glob file 2 action value from callback');

	t.end();
});

test.cb('Callback usage', actionWithACallbackCalledWithAValueMacro, (t, myCli) => {
	t.plan(6);

	function testEnd() {
		testEnd.callCount++;

		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	let returnedValueNotPromise = myCli(['command-1'], (err, result) => {
		t.is(err, null);

		t.is(result, 'glob file 1 action value from callback');

		testEnd();
	});

	t.is(returnedValueNotPromise, null);

	returnedValueNotPromise = myCli(['command-2'], (err, result) => {
		t.is(err, null);

		t.is(result, 'glob file 2 action value from callback');

		testEnd();
	});

	t.is(returnedValueNotPromise, null);
});

test.cb('Promise usage', actionWithACallbackCalledWithAValueMacro, (t, myCli) => {
	t.plan(4);

	function testEnd() {
		testEnd.callCount++;

		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	let returnedValuePromise = myCli(['command-1']);

	t.true(returnedValuePromise instanceof Promise);

	returnedValuePromise.then(result => {
		t.is(result, 'glob file 1 action value from callback');

		testEnd();
	});

	returnedValuePromise = myCli(['command-2']);

	t.true(returnedValuePromise instanceof Promise);

	returnedValuePromise.then(result => {
		t.is(result, 'glob file 2 action value from callback');

		testEnd();
	});
});

/*---------------------------*/

function actionReturningAPromiseResolvingAValueMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-tool',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/action-returning-a-promise-resolving-a-value/*.js')
		]
	});

	core(t, myCli);
}

actionReturningAPromiseResolvingAValueMacro.title = providedTitle => (
	`Action returning a Promise resolving a value - ${providedTitle}`
);

test.cb('Synchronous usage', actionReturningAPromiseResolvingAValueMacro, async (t, myCli) => {
	let returnedValuePromise = myCli(['command-1']);
	t.true(returnedValuePromise instanceof Promise);

	let returnedValue = await returnedValuePromise;
	t.is(returnedValue, 'glob file 1 action value from promise');

	returnedValuePromise = myCli(['command-2']);
	t.true(returnedValuePromise instanceof Promise);

	returnedValue = await returnedValuePromise;
	t.is(returnedValue, 'glob file 2 action value from promise');

	t.end();
});

test.cb('Callback usage', actionReturningAPromiseResolvingAValueMacro, (t, myCli) => {
	t.plan(6);

	function testEnd() {
		testEnd.callCount++;

		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	let returnedValueNotPromise = myCli(['command-1'], (err, result) => {
		t.is(err, null);

		t.is(result, 'glob file 1 action value from promise');

		testEnd();
	});

	t.is(returnedValueNotPromise, null);

	returnedValueNotPromise = myCli(['command-2'], (err, result) => {
		t.is(err, null);

		t.is(result, 'glob file 2 action value from promise');

		testEnd();
	});

	t.is(returnedValueNotPromise, null);
});

test.cb('Promise usage', actionReturningAPromiseResolvingAValueMacro, (t, myCli) => {
	t.plan(4);

	function testEnd() {
		testEnd.callCount++;

		if (testEnd.callCount === 2) {
			t.end();
		}
	}
	testEnd.callCount = 0;

	let returnedValuePromise = myCli(['command-1']);

	t.true(returnedValuePromise instanceof Promise);

	returnedValuePromise.then(result => {
		t.is(result, 'glob file 1 action value from promise');

		testEnd();
	});

	returnedValuePromise = myCli(['command-2']);

	t.true(returnedValuePromise instanceof Promise);

	returnedValuePromise.then(result => {
		t.is(result, 'glob file 2 action value from promise');

		testEnd();
	});
});