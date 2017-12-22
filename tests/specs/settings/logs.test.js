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
		'unvalidStderr'
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