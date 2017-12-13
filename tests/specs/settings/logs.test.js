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
		'unvalidNameParameter',
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

test('unvalidNameParameter', t => {
	const logs = requireFromIndex('sources/settings/logs');

	t.is(typeof logs.unvalidNameParameter, 'function');
	t.is(logs.unvalidNameParameter({ configType: 'test type' }), (
		`You must provide a not empty string as valid name parameter for your cli tool.`
	));
});