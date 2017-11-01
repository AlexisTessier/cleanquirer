'use strict';

const test = require('ava');
const sinon = require('sinon');

const argv = require('string-argv');

const requireFromIndex = require('../../utils/require-from-index');

test('ordered usage - one option', t => {
	const cleanquirer  = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'command',
				action,
				options: [{
					name: 'optionA'
				}]
			}
		]
	});

	cli(argv('command option-a-value'));

	t.true(action.calledOnce);
	const actionOptions = action.getCall(0).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'optionA',
		'stderr',
		'stdin',
		'stdout'
	]);

	t.is(actionOptions.optionA, 'option-a-value');
});

test('ordered usage - multiple option', t => {
	const cleanquirer  = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'command-test',
				action,
				options: [{
					name: 'optionA'
				}, {
					name: 'option-b'
				}, {
					name: 'optionC'
				}]
			}
		]
	});

	cli(argv('command-test option-a-value option-b-value "option c value"'));

	t.true(action.calledOnce);
	const actionOptions = action.getCall(0).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'option-b',
		'optionA',
		'optionC',
		'stderr',
		'stdin',
		'stdout'
	]);

	t.is(actionOptions.optionA, 'option-a-value');

	t.is(actionOptions['option-b'], 'option-b-value');

	t.is(actionOptions.optionC, 'option c value');
});

test.todo('ordered usage - one option - missing option handling');
test.todo('ordered usage - multiple option - missing option handling');

test.todo('ordered usage - one option - too much options handling');
test.todo('ordered usage - multiple option - too much options handling');

test.todo('unordered usage - one option');
test.todo('unordered usage - multiple option');

test.todo('unordered usage - one option - missing option handling');
test.todo('unordered usage - multiple option - missing option handling');

test.todo('unordered usage - one option - too much options handling');
test.todo('unordered usage - multiple option - too much options handling');

test.todo('mix ordered and unordered usage');
test.todo('mix ordered and unordered usage - missing option handling');
test.todo('mix ordered and unordered usage - too much options handling');

test.todo('option default value');
test.todo('option type');

test.todo('unvalid options parameter');
test.todo('unvalid option');
test.todo('unvalid option name');
test.todo('unvalid option type');
test.todo('duplicate option');

/* - deduce option from documented file - */

test.todo('option count detect inconsistency');
test.todo('option default value detect inconsistency');
test.todo('option type detect inconsistency');