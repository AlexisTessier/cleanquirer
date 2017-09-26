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

test.todo('Multiple commands definition from glob');
test.todo('Use a command from glob multiple times');
test.todo('Use commands from globs multiple times');