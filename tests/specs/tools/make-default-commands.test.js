'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type', t => {
	const makeDefaultCommands = requireFromIndex('sources/tools/make-default-commands');
	t.is(typeof makeDefaultCommands, 'function');
})

test.todo('behavior...')