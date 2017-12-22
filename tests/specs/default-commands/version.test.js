'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type', t => {
	const defaultVersionCommand = requireFromIndex('sources/default-commands/version');
	t.is(typeof defaultVersionCommand, 'function');
})

test.skip('usage with name option', t => {
	const defaultVersionCommand = requireFromIndex('sources/default-commands/version');
	t.is(typeof defaultVersionCommand, 'function');
})

test.skip('usage with version option', t => {
	const defaultVersionCommand = requireFromIndex('sources/default-commands/version');
	t.is(typeof defaultVersionCommand, 'function');
})

test.skip('usage with name and version option', t => {
	const defaultVersionCommand = requireFromIndex('sources/default-commands/version');
	t.is(typeof defaultVersionCommand, 'function');
})

test.skip('usage with no options', t => {
	const defaultVersionCommand = requireFromIndex('sources/default-commands/version');
	t.is(typeof defaultVersionCommand, 'function');
})