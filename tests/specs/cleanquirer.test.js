'use strict';

const test = require('ava');
const assert = require('assert');
const check = require('better-assert');

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

function synchronousCommandFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command',
				action(){
					actionFunction();
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

synchronousCommandFromSimpleCommandObjectMacro.title = providedTitle => (
	`Synchronous command from a simple command object - ${providedTitle}`);

test('Synchronous usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	cli(['command']);

	t.true(action.calledOnce);
});

test.cb('Callback usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(1);

	cli(['command'], err => {
		assert.equal(err, null);

		t.true(action.calledOnce);

		t.end();
	});
});

test('Promise usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(1);

	const cliPromise = cli(['command']);

	assert(cliPromise instanceof Promise);

	return cliPromise.then(() => {
		t.true(action.calledOnce);
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function synchronousCommandThrowingErrorFromSimpleCommandObjectMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'errormycli',
		commands: [
			{
				name: 'error-command',
				action(){
					throw new Error('error command error');
				}
			}
		]
	});

	const error = t.throws(()=>{
		core(t, myCli);
	});

	t.is(error.message, `Error happen when using the errormycli command "error-command" : error command error`);
}

synchronousCommandThrowingErrorFromSimpleCommandObjectMacro.title = providedTitle => (
	`Synchronous command throwing an error from a simple command object - ${providedTitle}`)

test('Synchronous usage', synchronousCommandThrowingErrorFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['error-command'])
});

test('Callback usage', synchronousCommandThrowingErrorFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['error-command'], err => {
		t.fail();
	})
});

test('Promise usage', synchronousCommandThrowingErrorFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['error-command']).then(()=>{
		t.fail();
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function asynchronousCommandCallbackFromSimpleCommandObjectMacro(t, core) {

}

test.todo('asynchronousCommandCallbackFromSimpleCommandObjectMacro');
test.todo('asynchronous command callback with error');

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.todo('asynchronousCommandPromiseFromSimpleCommandObjectMacro');
test.todo('asynchronous command promise with error');

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback',
				action(options, done){
					done();
				}
			}
		]
	});

	const useCallbackInSynchronousWayError = t.throws(()=>{
		core(t, myCli);
	});

	t.is(useCallbackInSynchronousWayError.message, 
		`The mycli command "callback" you are trying to use calls internally a callback in a synchronous way. This is not permitted by cleanquirer. If the command is synchronous, it shouldn't use neither callback or promise.`
	);
}

ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro.title = providedTitle => (
	`Throw error when using a synchronous callback command from a simple command object - ${providedTitle}`);

test('Synchronous usage', ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['callback']);
});

test('Callback usage', ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(3);

	cli(['callback'], err => {
		t.pass();
	});
});

test('Promise usage', ErrorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(2);

	cli(['callback']).then(()=>{
		t.fail();
	});
});

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

function ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'myclii',
		commands: [
			{
				name: 'callback-promise',
				action(options, done){
					return new Promise((resolve, reject) => {
						resolve();
					});
				}
			}
		]
	});

	const useCallbackAndPromiseError = t.throws(()=>{
		core(t, myCli);
	});

	t.is(useCallbackAndPromiseError.message, 
		`The myclii command "callback-promise" you are trying to use both uses internally a callback and returns a promise. This is not permitted by cleanquirer. If the command is asynchronous, it must use callback or promise but not both.`);
}

ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro.title = providedTitle => (
	`Throw error when using a both callback and promise command from a simple command object - ${providedTitle}`);

test('Synchronous usage', ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['callback-promise']);
});

test('Callback usage', ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(2);

	cli(['callback-promise'], err => {
		t.fail();
	});
});

test('Promise usage', ErrorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(2);

	cli(['callback-promise']).then(()=>{
		t.fail();
	});
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

	t.is(wrongCliInputError.message, `When using mycli as a function, you must provide an input to it as an Array like one from process.argv.slice(2).`);
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
