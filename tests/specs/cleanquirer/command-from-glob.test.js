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