'use strict';

const test = require('ava');
const assert = require('assert');

const requireFromIndex = require('../utils/require-from-index');
const mockFunction = require('../mocks/mock-function');

test('type and basic api', t => {
	const cleanquirerFromIndex = requireFromIndex('index');
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	assert.equal(cleanquirerFromIndex, cleanquirer);
	assert.equal(typeof cleanquirer, 'function');

	const myCli = cleanquirer({
		name: 'mycli'
	});

	assert.equal(typeof myCli, 'function');
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function unvalidConfigMacro(t, unvalidConfig) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidConfigError = t.throws(()=>{
		cleanquirer(unvalidConfig);
	});

	if (unvalidConfig !== null) {
		t.is(unvalidConfigError.message, `You must provide a valid configuration object to cleanquirer. ${typeof unvalidConfig} is not a valid type for a cleanquirer configuration.`);
	}
}

unvalidConfigMacro.title = (providedTitle, conf) => (
	`${providedTitle} - need a valid config like ${typeof conf} - ${typeof conf === 'object' ? JSON.stringify(conf) : typeof conf}`);

test(unvalidConfigMacro);
test(unvalidConfigMacro, undefined);
test(unvalidConfigMacro, []);
test(unvalidConfigMacro, 2);
test(unvalidConfigMacro, true);
test(unvalidConfigMacro, false);
test(unvalidConfigMacro, null);
test(unvalidConfigMacro, 'unvalid');
test(unvalidConfigMacro, '  ');
test(unvalidConfigMacro, function () {});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function noNameParameterMacro(t, configWithNoName) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const noValidNameError = t.throws(()=>{
		cleanquirer(configWithNoName);
	});

	t.is(noValidNameError.message, `You must provide a not empty string as valid name parameter for your cli tool.`);
}

noNameParameterMacro.title = (providedTitle, data) => (
	`${providedTitle} - need a name parameter or throw an error with config like ${JSON.stringify(data)}`);

test(noNameParameterMacro, {});
test(noNameParameterMacro, {name: '  '});
test(noNameParameterMacro, {name: ''});
test(noNameParameterMacro, {noname: ''});
test(noNameParameterMacro, {name: true});
test(noNameParameterMacro, {name: false});
test(noNameParameterMacro, {name: {}});
test(noNameParameterMacro, {name: []});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test('Creating then using a synchronous command from a simple command object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const action = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command',
				action
			}
		]
	});

	myCli(['command']);

	t.true(action.calledOnce);
});

test('Creating then using a synchronous callback command from a simple command object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback',
				action(options, done){
					actionFunction();
					done();
				}
			}
		]
	});

	myCli(['callback']);

	t.true(actionFunction.calledOnce);
});

test('Creating then using a synchronous promise command from a simple command object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback',
				action(options){
					return new Promise((resolve, reject) => {
						actionFunction();
					});
				}
			}
		]
	});

	myCli(['callback']);

	t.true(actionFunction.calledOnce);
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function wrongCliInputMacro(t, wrongInput) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli'
	});

	const wrongCliInputError = t.throws(()=>{
		myCli(wrongInput);
	});

	t.is(wrongCliInputError.message, `When using mycli as a function, you must provide an input to it as an Array like one from process.argv.slice(2)`);
}

wrongCliInputMacro.title = (providedTitle, input) => (
	`${providedTitle} - throws error if provided input is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`)

test(wrongCliInputMacro);
test(wrongCliInputMacro, undefined);
test(wrongCliInputMacro, {});
test(wrongCliInputMacro, 2);
test(wrongCliInputMacro, true);
test(wrongCliInputMacro, false);
test(wrongCliInputMacro, null);
test(wrongCliInputMacro, '  ');
test(wrongCliInputMacro, 'wrong input');
test(wrongCliInputMacro, function () {});
