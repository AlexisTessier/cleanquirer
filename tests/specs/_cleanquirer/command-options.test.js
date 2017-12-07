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

test('from object - ordered usage - one option - with multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionA = sinon.spy();
	const actionB = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'test',
				action: actionA,
				options: [{
					name: 'optionA'
				}]
			},
			{
				name: 'commandbis',
				action: actionB,
				options: [{
					name: 'optionB'
				}]
			}
		]
	});

	cli(argv('commandbis option-b-value'));
	t.true(actionA.notCalled);
	t.true(actionB.calledOnce);
	let actionOptions = actionB.getCall(0).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'optionB',
		'stderr',
		'stdin',
		'stdout'
	]);
	t.is(actionOptions.optionB, 'option-b-value');

	cli(argv('test option-a-value'));
	t.true(actionA.calledOnce);
	t.true(actionB.calledOnce);
	actionOptions = actionA.getCall(0).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'optionA',
		'stderr',
		'stdin',
		'stdout'
	]);
	t.is(actionOptions.optionA, 'option-a-value');

	cli(argv('test option-a-value2'));
	t.true(actionA.calledTwice);
	t.true(actionB.calledOnce);
	actionOptions = actionA.getCall(1).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'optionA',
		'stderr',
		'stdin',
		'stdout'
	]);
	t.is(actionOptions.optionA, 'option-a-value2');

	cli(argv('commandbis option-b-value-bis'));
	t.true(actionA.calledTwice);
	t.true(actionB.calledTwice);
	actionOptions = actionB.getCall(1).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'optionB',
		'stderr',
		'stdin',
		'stdout'
	]);
	t.is(actionOptions.optionB, 'option-b-value-bis');
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
test('from object - ordered usage - multiple - with multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionA = sinon.spy();
	const actionB = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'acom',
				action: actionA,
				options: [{
					name: 'optionA'
				}, {
					name: 'option-b'
				}, {
					name: 'optionC'
				}]
			},
			{
				name: 'bcom',
				action: actionB,
				options: [{
					name: 'optionA'
				}, {
					name: 'optionC'
				}]
			}
		]
	});

	cli(argv('acom option-a-value option-b-value "option c value"'));
	t.true(actionA.calledOnce);
	t.true(actionB.notCalled);
	let actionOptions = actionA.getCall(0).args[0];
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

	cli(argv('acom option-a-value2 option-b2-value 42'));
	t.true(actionA.calledTwice);
	t.true(actionB.notCalled);
	actionOptions = actionA.getCall(1).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'option-b',
		'optionA',
		'optionC',
		'stderr',
		'stdin',
		'stdout'
	]);
	t.is(actionOptions.optionA, 'option-a-value2');
	t.is(actionOptions['option-b'], 'option-b2-value');
	t.is(actionOptions.optionC, '42');

	cli(argv('bcom 12 222'));
	t.true(actionA.calledTwice);
	t.true(actionB.calledOnce);
	actionOptions = actionB.getCall(0).args[0];
	t.deepEqual(Object.keys(actionOptions).sort(), [
		'cli',
		'optionA',
		'optionC',
		'stderr',
		'stdin',
		'stdout'
	]);
	t.is(actionOptions.optionA, '12');
	t.is(actionOptions.optionC, '222');
});

test.todo('variations with multiple commands and calls');
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

test.todo('variations with multiple commands and calls');
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

test.todo('variations with multiple commands and calls');
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

test.todo('variations with multiple commands and calls');
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

test.todo('variations with multiple commands and calls');
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

/*-------------*/

test('from object - option hasDefaultValue setted to true - 1 option not missing', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-no-default-option',
				action({
					anOption = 'default option value'
				}){
					actionDetect();
					optionValue = anOption;
				},
				options: [{
					name: 'anOption',
					hasDefaultValue: true
				}]
			}
		]
	});

	cli(argv('command-with-no-default-option expectedValue'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, 'expectedValue');
});
test('from object - option hasDefaultValue setted to false - 1 option not missing', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-no-default-option',
				action({
					rockOption
				}){
					actionDetect();
					optionValue = rockOption;
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: false
				}]
			}
		]
	});

	cli(argv('command-with-no-default-option expectedValue'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, 'expectedValue');
});

test('from object - option hasDefaultValue setted to true - 1 option not missing and no default defined', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-test',
				action({
					aoption
				}){
					actionDetect();
					optionValue = aoption;
				},
				options: [{
					name: 'aoption',
					hasDefaultValue: true
				}]
			}
		]
	});

	cli(argv('command-test expectedValue2'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, 'expectedValue2');
});
test('from object - option hasDefaultValue setted to false - 1 option not missing but default defined', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-no-default-option',
				action({
					rockOption = 'unexpected value'
				}){
					actionDetect();
					optionValue = rockOption;
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: false
				}]
			}
		]
	});

	cli(argv('command-with-no-default-option expectedValue'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, 'expectedValue');
});

test('from object - option hasDefaultValue setted to true - 1 option missing', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-default-option',
				action({
					rockOption = 'default expected value'
				}){
					actionDetect();
					optionValue = rockOption;
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: true
				}]
			}
		]
	});

	cli(argv('command-with-default-option'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, 'default expected value');
});
test('from object - option hasDefaultValue setted to false - 1 option missing', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-no-default-option',
				action({
					rockOption
				}){
					actionDetect();
					optionValue = rockOption;
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: false
				}]
			}
		]
	});

	const missingOptionError = t.throws(()=>{
		cli(argv('command-with-no-default-option'));
	});

	t.is(missingOptionError.message,
		`cli-test-y command-with-no-default-option requires a missing option "rockOption".`
	);
});

test.todo('from object - option hasDefaultValue setted to true - 1 option missing but no default defined');
test('from object - option hasDefaultValue setted to false - 1 option missing but default defined', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-no-default-option',
				action({
					rockOption = 'a default value'
				}){
					actionDetect();
					optionValue = rockOption;
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: false
				}]
			}
		]
	});

	const missingOptionError = t.throws(()=>{
		cli(argv('command-with-no-default-option'));
	});

	t.is(missingOptionError.message,
		`cli-test-y command-with-no-default-option requires a missing option "rockOption".`
	);
});

test.todo('variation with true');
test.skip('v0.2 from object - option hasDefaultValue setted to false - 2 options', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');


});

test.todo('variation with true');
test.skip('v0.2 from object - option hasDefaultValue setted to false - 3 options', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');


});

test.todo('variation with true');
test.skip('v0.2 from object - option hasDefaultValue setted to false - multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');


});

test.todo('v0.2 from object - option type - default');
test.todo('v0.2 from object - option type - string');
test.todo('v0.2 from object - option type - number');
test.todo('v0.2 from object - option type - boolean');
test.todo('v0.2 from object - option type - object');

test.todo('v0.2 from object - unvalid options parameter');
test.todo('v0.2 from object - unvalid option');
test.todo('v0.2 from object - unvalid option name');
test.todo('v0.2 from object - unvalid option hasDefaultValue');
test.todo('v0.2 from object - unvalid option type');
test.todo('v0.2 from object - duplicate option');

/* - deduce option from documented file - */

test.todo('v0.2 variations options from file');
test.todo('v0.2 from file - option count detect inconsistency');
test.todo('v0.2 from file - option hasDefaultValue detect inconsistency');
test.todo('v0.2 from file - option type detect inconsistency');

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