'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test('type and basic usage', t => {
	const msg = requireFromIndex('sources/msg');

	t.is(typeof msg, 'function');

	t.is(msg('hello', 'beautiful', 'world', '!!!'), 'hello beautiful world !!!');
});