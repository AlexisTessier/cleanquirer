'use strict';

const test = require('ava');
const sinon = require('sinon');

const argv = require('string-argv');

const requireFromIndex = require('../../utils/require-from-index');

test('option support - one option - ordered usage', t => {
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

test('option support - multiple option - ordered usage', t => {
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

test.todo('option support - one option - unordered usage');
test.todo('option support - multiple option - unordered usage');

test.todo('missing option handling - one option - ordered usage');
test.todo('missing option handling - multiple option - ordered usage');

test.todo('missing option handling - one option - unordered usage');
test.todo('missing option handling - multiple option - unordered usage');