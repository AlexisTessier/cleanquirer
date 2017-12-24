'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

test('type', t => {
	const getTypedValue = requireFromIndex('sources/tools/get-typed-value');
	t.is(typeof getTypedValue, 'function');
})

test.todo('behavior...')