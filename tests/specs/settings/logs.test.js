'use strict';

const test = require('ava');

const msg = require('@alexistessier/msg');
const stringable = require('stringable');

const requireFromIndex = require('../../utils/require-from-index');

test.todo('Add type assertions to check parameters');

test('Type and content', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs, 'object');

	t.deepEqual(Object.keys(logs).sort(), [
		'unvalidConfigurationObject',
		'unvalidName',
		'unvalidVersion',
		'unvalidOptions',
		'unvalidStdin',
		'unvalidStdout',
		'unvalidStderr',
		'unvalidCommandType',
		'unvalidCommandName',
		'unvalidCommandAction'
	].sort());
});

test('unvalidConfigurationObject', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidConfigurationObject, 'function');
	t.is(logs.unvalidConfigurationObject({ config: 'test type' }), msg(
		`You must provide a valid configuration object to cleanquirer.`,
		`${stringable('test type')} is not a valid cleanquirer configuration.`
	));

	t.is(logs.unvalidConfigurationObject({ config: 42 }), msg(
		`You must provide a valid configuration object to cleanquirer.`,
		`${stringable(42)} is not a valid cleanquirer configuration.`
	));
});

test('unvalidName', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidName, 'function');
	t.is(logs.unvalidName(), (
		`You must provide a not empty string as valid name parameter for your cli tool.`
	));
});

test('unvalidVersion', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidVersion, 'function');
	t.is(logs.unvalidVersion(), (
		`You must provide a not empty string or a number as valid version parameter for your cli tool.`
	));
});

test('unvalidOptions', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidOptions, 'function');
	t.is(logs.unvalidOptions(), (
		`You must provide an object as options parameter for your cli tool.`
	));
});

test('unvalidStdin', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidStdin, 'function');
	t.is(logs.unvalidStdin(), (
		`You must provide a readable stream as stdin option for your cli tool.`
	));
});

test('unvalidStdout', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidStdout, 'function');
	t.is(logs.unvalidStdout(), (
		`You must provide a writable stream as stdout option for your cli tool.`
	));
});

test('unvalidStderr', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidStderr, 'function');
	t.is(logs.unvalidStderr(), (
		`You must provide a writable stream as stderr option for your cli tool.`
	));
});

test('unvalidCommandType', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidCommandType, 'function');
	t.is(logs.unvalidCommandType({}), msg(
		`The provided undefined command object at index undefined`,
		`must be an object. Currently, it's of type undefined.`
	));

	t.is(logs.unvalidCommandType({name: 'cli', index: 56, type: 'object'}), msg(
		`The provided cli command object at index 56`,
		`must be an object. Currently, it's of type object.`
	));

	t.is(logs.unvalidCommandType({name: 'clitest', index: 4, type: 'function'}), msg(
		`The provided clitest command object at index 4`,
		`must be an object. Currently, it's of type function.`
	));
});

test('unvalidCommandName', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidCommandName, 'function');
	t.is(logs.unvalidCommandName({}), (
		`The provided undefined command object at index undefined has no name.`
	));

	t.is(logs.unvalidCommandName({name: 'cli', index: 6}), (
		`The provided cli command object at index 6 has no name.`
	));

	t.is(logs.unvalidCommandName({name: 'logcli', index: 42}), (
		`The provided logcli command object at index 42 has no name.`
	));
});

test('unvalidCommandAction', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidCommandAction, 'function');
	t.is(logs.unvalidCommandAction({}), msg(
		`The provided undefined command object at index undefined`,
		`has no action defined. A valid action must be a function.`
	));

	t.is(logs.unvalidCommandAction({name: 'test', index: 5}), msg(
		`The provided test command object at index 5`,
		`has no action defined. A valid action must be a function.`
	));

	t.is(logs.unvalidCommandAction({name: 'cli', index: 8}), msg(
		`The provided cli command object at index 8`,
		`has no action defined. A valid action must be a function.`
	));
});