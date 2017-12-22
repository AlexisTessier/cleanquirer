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

test('from object - ordered usage - one option - missing option handling - with multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionA = sinon.spy();
	const actionB = sinon.spy();
	const actionC = sinon.spy();

	const cli = cleanquirer({
		name: 'multi',
		commands: [
			{
				name: 'command-a',
				action: actionA,
				options: [{
					name: 'optionA'
				}]
			},
			{
				name: 'b',
				action: actionB,
				options: [{
					name: 'bo'
				}]
			},
			{
				name: 'cc',
				action: actionC,
				options: [{
					name: 'C'
				}]
			}
		]
	});

	let missingOptionError = t.throws(()=>{
		cli(argv('command-a'));
	});
	t.is(missingOptionError.message, `multi command-a requires a missing option "optionA".`);

	missingOptionError = t.throws(()=>{
		cli(argv('cc'));
	});
	t.is(missingOptionError.message, `multi cc requires a missing option "C".`);

	missingOptionError = t.throws(()=>{
		cli(argv('cc'));
	});
	t.is(missingOptionError.message, `multi cc requires a missing option "C".`);

	missingOptionError = t.throws(()=>{
		cli(argv('b'));
	});
	t.is(missingOptionError.message, `multi b requires a missing option "bo".`);

	missingOptionError = t.throws(()=>{
		cli(argv('cc'));
	});
	t.is(missingOptionError.message, `multi cc requires a missing option "C".`);

	missingOptionError = t.throws(()=>{
		cli(argv('command-a'));
	});
	t.is(missingOptionError.message, `multi command-a requires a missing option "optionA".`);

	missingOptionError = t.throws(()=>{
		cli(argv('b'));
	});
	t.is(missingOptionError.message, `multi b requires a missing option "bo".`);
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

test('from object - ordered usage - multiple option - missing option handling - with multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = sinon.spy();
	const action2 = sinon.spy();

	const cli = cleanquirer({
		name: 'cli-err',
		commands: [
			{
				name: 'a',
				action,
				options: [{
					name: 'optionA'
				}, {
					name: 'optionD'
				}, {
					name: 'last'
				}]
			},
			{
				name: 'c2',
				action: action2,
				options: [{
					name: '2A'
				}, {
					name: '2B'
				}, {
					name: '2c'
				}]
			}
		]
	});

	let missingOptionError = t.throws(()=>{
		cli(argv('a "value for a option"'));
	});
	t.is(missingOptionError.message, `cli-err a requires a missing option "optionD".`);

	missingOptionError = t.throws(()=>{
		cli(argv('c2 2 8'));
	});
	t.is(missingOptionError.message, `cli-err c2 requires a missing option "2c".`);

	missingOptionError = t.throws(()=>{
		cli(argv('a end notlast'));
	});
	t.is(missingOptionError.message, `cli-err a requires a missing option "last".`);

	missingOptionError = t.throws(()=>{
		cli(argv('a'));
	});
	t.is(missingOptionError.message, `cli-err a requires a missing option "optionA".`);

	missingOptionError = t.throws(()=>{
		cli(argv('c2'));
	});
	t.is(missingOptionError.message, `cli-err c2 requires a missing option "2A".`);
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

	t.true(action.notCalled)

	t.is(tooMuchOptionError.message, msg(
		`cli-test-3 command-a requires no option`,
		`but found value "unknow" for an unknow option at position 1.`
	));
});

test('from object - ordered usage - no option - too much options handling - with multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionOne = sinon.spy();
	const actionTwo = sinon.spy();

	const cli = cleanquirer({
		name: 'jarjar',
		commands: [
			{
				name: 'one',
				action: actionOne
			},
			{
				name: 'two',
				action: actionTwo
			}
		]
	});

	let tooMuchOptionError = t.throws(()=>{
		cli(argv('one 2'));
	});

	t.true(actionOne.notCalled)
	t.true(actionTwo.notCalled)

	t.is(tooMuchOptionError.message, msg(
		`jarjar one requires no option`,
		`but found value "2" for an unknow option at position 1.`
	));

	tooMuchOptionError = t.throws(()=>{
		cli(argv('one 9 8'));
	});

	t.true(actionOne.notCalled)
	t.true(actionTwo.notCalled)

	t.is(tooMuchOptionError.message, msg(
		`jarjar one requires no option`,
		`but found value "9" for an unknow option at position 1.`
	));

	tooMuchOptionError = t.throws(()=>{
		cli(argv('two 42'));
	});

	t.true(actionOne.notCalled)
	t.true(actionTwo.notCalled)

	t.is(tooMuchOptionError.message, msg(
		`jarjar two requires no option`,
		`but found value "42" for an unknow option at position 1.`
	));

	tooMuchOptionError = t.throws(()=>{
		cli(argv('one 42.7'));
	});

	t.true(actionOne.notCalled)
	t.true(actionTwo.notCalled)

	t.is(tooMuchOptionError.message, msg(
		`jarjar one requires no option`,
		`but found value "42.7" for an unknow option at position 1.`
	));

	tooMuchOptionError = t.throws(()=>{
		cli(argv('two hello world'));
	});

	t.true(actionOne.notCalled)
	t.true(actionTwo.notCalled)

	t.is(tooMuchOptionError.message, msg(
		`jarjar two requires no option`,
		`but found value "hello" for an unknow option at position 1.`
	));
});

test.skip('variations with multiple commands and calls', t => t);
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

test.skip('variations with multiple commands and calls', t => t);
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

//  variations for hasDefaultValue
//  ------------------------------
//  1) true / option missing / default defined
// 	2) true / option missing / default not defined
// 	3) true / option not missing / default defined
// 	4) true / option not missing / default not defined
// 	5) false / option missing / default defined
// 	6) false / option missing / default not defined
// 	7) false / option not missing / default defined
// 	8) false / option not missing / default not defined

test.todo('v0.2 variations with 2 options. yet done: 1)');
test.todo('v0.2 variations with multiple commands and calls. yet done: 1)');

test('1) from object - hasDefaultValue with 1 option - true / option missing / default defined', t => {
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

test('1) from object - hasDefaultValue with 2 options - true / option missing / default defined', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect1 = sinon.spy();
	const actionDetect2 = sinon.spy();
	let optionValue1 = null;
	let optionValue2 = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-default-option',
				action({
					rockOption = 'default expected value'
				}){
					actionDetect1();
					optionValue1 = rockOption;
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: true
				}]
			},
			{
				name: 'command-2',
				action({
					upOpt = 'def opt val'
				}){
					actionDetect2();
					optionValue2 = upOpt;
				},
				options: [{
					name: 'upOpt',
					hasDefaultValue: true
				}]
			}
		]
	});

	t.true(actionDetect1.notCalled);
	t.true(actionDetect2.notCalled);

	cli(argv('command-with-default-option'));
	t.true(actionDetect1.calledOnce);
	t.true(actionDetect2.notCalled);
	t.is(optionValue1, 'default expected value');

	cli(argv('command-2'));
	t.true(actionDetect1.calledOnce);
	t.true(actionDetect2.calledOnce);
	t.is(optionValue2, 'def opt val');
});

test('1) from object - hasDefaultValue with 2 options - true / option missing / default defined - multiple commands and calls', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect1 = sinon.spy();
	const actionDetect2 = sinon.spy();
	let optionValue1 = null;
	let optionValue2 = null;
	let count1 = 0;
	let count2 = 0;

	const cli = cleanquirer({
		name: 'cli-test-t',
		commands: [
			{
				name: 'command-with-default-option',
				action({
					rockOption = 'default expected value'
				}){
					actionDetect1();
					optionValue1 = rockOption+(++count1);
				},
				options: [{
					name: 'rockOption',
					hasDefaultValue: true
				}]
			},
			{
				name: 'command-2',
				action({
					upOpt = 'def opt val'
				}){
					actionDetect2();
					optionValue2 = upOpt+(++count2);
				},
				options: [{
					name: 'upOpt',
					hasDefaultValue: true
				}]
			}
		]
	});

	t.true(actionDetect1.notCalled);
	t.true(actionDetect2.notCalled);

	cli(argv('command-with-default-option'));
	t.true(actionDetect1.calledOnce);
	t.true(actionDetect2.notCalled);
	t.is(optionValue1, 'default expected value1');

	cli(argv('command-2'));
	t.true(actionDetect1.calledOnce);
	t.true(actionDetect2.calledOnce);
	t.is(optionValue2, 'def opt val1');

	cli(argv('command-with-default-option'));
	t.true(actionDetect1.calledTwice);
	t.true(actionDetect2.calledOnce);
	t.is(optionValue1, 'default expected value2');

	cli(argv('command-2'));
	t.true(actionDetect1.calledTwice);
	t.true(actionDetect2.calledTwice);
	t.is(optionValue2, 'def opt val2');
});

test('2) from object - hasDefaultValue with 1 option - true / option missing / default not defined', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-default-option',
				action({
					softOption
				}){
					actionDetect();
					optionValue = softOption;
				},
				options: [{
					name: 'softOption',
					hasDefaultValue: true
				}]
			}
		]
	});

	cli(argv('command-with-default-option'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, undefined);
});

test.skip('2) from object - hasDefaultValue with 2 options - true / option missing / default not defined', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionDetect = sinon.spy();
	let optionValue = null;

	const cli = cleanquirer({
		name: 'cli-test-y',
		commands: [
			{
				name: 'command-with-default-option',
				action({
					softOption
				}){
					actionDetect();
					optionValue = softOption;
				},
				options: [{
					name: 'softOption',
					hasDefaultValue: true
				}]
			}
		]
	});

	cli(argv('command-with-default-option'));
	t.true(actionDetect.calledOnce);
	t.is(optionValue, undefined);
});

test('3) from object - hasDefaultValue with 1 option - true / option not missing / default defined', t => {
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

test.skip('3) from object - hasDefaultValue with 2 options - true / option not missing / default defined', t => {
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

test('4) from object - hasDefaultValue with 1 option - true / option not missing / default not defined', t => {
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

test.skip('4) from object - hasDefaultValue with 2 options - true / option not missing / default not defined', t => {
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

test('5) from object - hasDefaultValue with 1 option - false / option missing / default defined', t => {
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

test.skip('5) from object - hasDefaultValue with 2 options - false / option missing / default defined', t => {
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

test('6) from object - hasDefaultValue with 1 option - false / option missing / default not defined', t => {
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

test.skip('6) from object - hasDefaultValue with 2 options - false / option missing / default not defined', t => {
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

test('7) from object - hasDefaultValue with 1 option - false / option not missing / default defined', t => {
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

test.skip('7) from object - hasDefaultValue with 2 options - false / option not missing / default defined', t => {
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

test('8) from object - hasDefaultValue with 1 option - false / option not missing / default not defined', t => {
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

test.skip('8) from object - hasDefaultValue with 2 options - false / option not missing / default not defined', t => {
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


/*-----------------------------------*/

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

test.todo('v0.2 variations options from action function');
test.todo('v0.2 from action function - option count detect inconsistency');
test.todo('v0.2 from action function - option hasDefaultValue detect inconsistency');
test.todo('v0.2 from action function - option type detect inconsistency');

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