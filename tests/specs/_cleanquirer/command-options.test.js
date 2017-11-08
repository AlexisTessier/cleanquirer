'use strict';

const test = require('ava');
const sinon = require('sinon');

const argv = require('string-argv');

const msg = require('@alexistessier/msg');

const requireFromIndex = require('../../utils/require-from-index');

test('from object - ordered usage - one option', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

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

test('from object - ordered usage - multiple option', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

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

test('from object - ordered usage - one option - missing option handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test-2',
		commands: [
			{
				name: 'command-one',
				action,
				options: [{
					name: 'optionA'
				}]
			}
		]
	});

	const missingOptionError = t.throws(()=>{
		cli(argv('command-one'));
	});

	t.is(missingOptionError.message, `cli-test-2 command-one requires a missing option "optionA".`);
});

test('from object - ordered usage - multiple option - missing option handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'command',
				action,
				options: [{
					name: 'optionA'
				}, {
					name: 'option-b'
				}, {
					name: 'option_c'
				}, {
					name: 'optionD'
				}]
			}
		]
	});

	const missingOptionError = t.throws(()=>{
		cli(argv('command "value for a option" 42'));
	});

	t.is(missingOptionError.message, `cli-test command requires a missing option "option_c".`);
});

test('from object - ordered usage - no option - too much options handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test-3',
		commands: [
			{
				name: 'command-a',
				action
			}
		]
	});

	const tooMuchOptionError = t.throws(()=>{
		cli(argv('command-a unknow'));
	});

	t.is(tooMuchOptionError.message, msg(
		`cli-test-3 command-a requires no option`,
		`but found value "unknow" for an unknow option at position 1.`
	));
});

test('from object - ordered usage - one option - too much options handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test-x',
		commands: [
			{
				name: 'command-b',
				action,
				options: [{
					name: 'optionA'
				}]
			}
		]
	});

	const tooMuchOptionError = t.throws(()=>{
		cli(argv('command-b "option value A" 35'));
	});

	t.is(tooMuchOptionError.message, msg(
		`cli-test-x command-b requires only 1 option`,
		`but found value "35" for an unknow option at position 2.`
	));
});

test('from object - ordered usage - multiple option - too much options handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-c',
				action,
				options: [{
					name: 'optionC'
				}, {
					name: 'optionB'
				}, {
					name: 'opt3'
				}, {
					name: 'opt4'
				}]
			}
		]
	});

	const tooMuchOptionError = t.throws(()=>{
		cli(argv('command-c "option value A" 35 hello unknow "unknow value"'));
	});

	t.is(tooMuchOptionError.message, msg(
		`cli-test-y command-c requires only 4 options`,
		`but found value "unknow value" for an unknow option at position 5.`
	));
});

test.todo('variations with multiple commands');
test.todo('variations with multiple calls');

test.todo('variations with multiple commands - missing options');
test.todo('variations with multiple calls - missing options');

test.todo('variations with multiple commands - too much options');
test.todo('variations with multiple calls - too much options');

/*-------------*/

test.todo('from object - option hasDefaultValue');
test.todo('from object - option type - default');
test.todo('from object - option type - string');
test.todo('from object - option type - number');
test.todo('from object - option type - boolean');
test.todo('from object - option type - object');

test.todo('from object - unvalid options parameter');
test.todo('from object - unvalid option');
test.todo('from object - unvalid option name');
test.todo('from object - unvalid option type');
test.todo('from object - duplicate option');

/* - deduce option from documented file - */

test.todo('variations options from file');
test.todo('from file - option count detect inconsistency');
test.todo('from file - option hasDefaultValue detect inconsistency');
test.todo('from file - option type detect inconsistency');

/*------------*/

test.todo('from object - unordered usage - one option');
test.todo('from object - unordered usage - multiple option');

test.todo('from object - unordered usage - one option - missing option handling');
test.todo('from object - unordered usage - multiple option - missing option handling');

test.todo('from object - unordered usage - one option - too much options handling');
test.todo('from object - unordered usage - multiple option - too much options handling');

test.todo('from object - mix ordered and unordered usage');
test.todo('from object - mix ordered and unordered usage - missing option handling');
test.todo('from object - mix ordered and unordered usage - too much options handling');