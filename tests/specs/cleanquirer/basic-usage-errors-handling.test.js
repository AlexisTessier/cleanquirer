'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

const mockFunction = require('../../mocks/mock-function');

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

/*---------------------------*/

function asynchronousCommandCallbackFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback-command',
				action(options, done){
					setTimeout(()=>{
						actionFunction();
						done();
					}, t.context.asyncTimeout);
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandCallbackFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous callback command from simple command object - ${providedTitle}`);

/*---------------------------*/

function asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'callback-command',
				action(options, done){
					setTimeout(()=>{
						actionFunction();
						done(new Error('callback error'));
						actionFunction();
					}, t.context.asyncTimeout);
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous callback command with error from simple command object - ${providedTitle}`);

/*---------------------------*/

function asynchronousCommandPromiseFromSimpleCommandObjectMacro(t, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'promise-command',
				action(){
					actionFunction();

					return new Promise(resolve => {
						actionFunction();
						setTimeout(()=>{
							actionFunction();
							resolve();
							actionFunction();
						}, t.context.asyncTimeout);
					});
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandPromiseFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous promise command from simple command object - ${providedTitle}`);

/*---------------------------*/

function asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro(t, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction = mockFunction();

	t.context.asyncTimeout = 50;

	const myCli = cleanquirer({
		name: 'myerrorcli',
		commands: [
			{
				name: 'promise-error-command',
				action(){
					actionFunction();

					return new Promise((resolve, reject) => {
						actionFunction();
						setTimeout(()=>{
							actionFunction();
							reject(new Error(`promise command rejected error`));
							actionFunction();
						}, t.context.asyncTimeout);
					});
				}
			}
		]
	});

	return core(t, myCli, actionFunction);
}

asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro.title = providedTitle => (
	`Asynchronous promise command with rejection from simple command object - ${providedTitle}`);

/*---------------------------*/

function errorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro(t, core) {
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
	t.is(useCallbackInSynchronousWayError.constructor.name, 'CleanquirerCommandImplementationError');
}

errorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro.title = providedTitle => (
	`Throw error when using a synchronous callback command from a simple command object - ${providedTitle}`);

/*---------------------------*/

function errorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro(t, core) {
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
	t.is(useCallbackAndPromiseError.constructor.name, 'CleanquirerCommandImplementationError');
}

errorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro.title = providedTitle => (
	`Throw error when using a both callback and promise command from a simple command object - ${providedTitle}`);

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

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

test(noNameParameterMacro, {});
test(noNameParameterMacro, {name: '  '});
test(noNameParameterMacro, {name: ''});
test(noNameParameterMacro, {noname: ''});
test(noNameParameterMacro, {name: true});
test(noNameParameterMacro, {name: false});
test(noNameParameterMacro, {name: {}});
test(noNameParameterMacro, {name: []});

/*---------------------------*/

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

/*---------------------------*/

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

test.cb('Synchronous usage', asynchronousCommandCallbackFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['callback-command']);

	t.true(action.notCalled);

	setTimeout(()=>{
		t.true(action.calledOnce);

		t.end();
	}, t.context.asyncTimeout*2);
});

test.cb('Callback usage', asynchronousCommandCallbackFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(2);

	cli(['callback-command'], () => {
		t.true(action.calledOnce);
		t.end();
	});

	t.true(action.notCalled);
});

test('Promise usage', asynchronousCommandCallbackFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(3);

	const cliPromise = cli(['callback-command']);

	t.true(cliPromise instanceof Promise);
	t.true(action.notCalled);

	return cliPromise.then(()=>{
		t.true(action.calledOnce);
	});
});

/*---------------------------*/

test.cb('Synchronous usage', asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['callback-command']).then(()=>{}).catch(()=>{});

	t.true(action.notCalled);

	setTimeout(()=>{
		t.true(action.calledTwice);

		t.end();
	}, t.context.asyncTimeout*2);
});

test.cb('Callback usage', asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(6);

	cli(['callback-command'], err => {
		t.true(action.calledOnce);

		t.true(err instanceof Error);
		t.is(err.message, `mycli callback-command error: callback error`);
	});

	t.true(action.notCalled);

	setTimeout(()=>{
		t.true(action.calledTwice);

		t.end();
	}, t.context.asyncTimeout*2);
});

test('Promise usage', asynchronousCommandCallbackWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(6);

	const cliPromise = cli(['callback-command']);
	
	t.true(cliPromise instanceof Promise);
	t.true(action.notCalled);

	return cliPromise.then(()=>{t.fail()}).catch(err => {
		t.true(action.calledTwice);

		t.true(err instanceof Error);
		t.is(err.message, `mycli callback-command error: callback error`);
	});
});

/*---------------------------*/

test.cb('Synchronous usage', asynchronousCommandPromiseFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['promise-command']);

	t.true(action.calledTwice);

	setTimeout(()=>{
		t.is(action.callCount, 4);

		t.end();
	}, t.context.asyncTimeout*2);
});

test.cb('Callback usage', asynchronousCommandPromiseFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(4);

	cli(['promise-command'], ()=>{
		t.is(action.callCount, 4);
	});

	t.true(action.calledTwice);

	setTimeout(()=>{
		t.is(action.callCount, 4);

		t.end();
	}, t.context.asyncTimeout*2);
});

test('Promise usage', asynchronousCommandPromiseFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(3);

	const cliPromise = cli(['promise-command']);

	t.true(cliPromise instanceof Promise);

	t.true(action.calledTwice);

	return cliPromise.then(()=>{
		t.is(action.callCount, 4);
	});
});

/*---------------------------*/

test.cb('Synchronous usage', asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.true(typeof t.context.asyncTimeout === 'number');

	t.plan(3);

	cli(['promise-error-command']).then(()=>{}).catch(()=>{});

	t.true(action.calledTwice);

	setTimeout(()=>{
		t.is(action.callCount, 4);

		t.end();
	}, t.context.asyncTimeout*2);	
});

test.cb('Callback usage', asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(4);

	cli(['promise-error-command'], err => {
		t.is(action.callCount, 4);

		t.true(err instanceof Error);
		t.is(err.message, 'myerrorcli promise-error-command error: promise command rejected error');

		t.end();
	});

	t.true(action.calledTwice);
});

test('Promise usage', asynchronousCommandPromiseWithErrorFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(5);

	const cliPromise = cli(['promise-error-command']);

	t.true(cliPromise instanceof Promise);

	t.true(action.calledTwice);

	return cliPromise.then(()=>t.fail()).catch(err => {
		t.is(action.callCount, 4);

		t.true(err instanceof Error);
		t.is(err.message, 'myerrorcli promise-error-command error: promise command rejected error');
	});
});

/*---------------------------*/

test('Synchronous usage', errorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['callback']);
});

test('Callback usage', errorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(3);

	cli(['callback'], err => {
		t.fail();
	});	
});

test('Promise usage', errorUsingCallbackCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(3);

	cli(['callback']).then(()=>{
		t.fail();
	});
});

/*---------------------------*/

test('Synchronous usage', errorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	cli(['callback-promise']);
});

test('Callback usage', errorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(3);

	cli(['callback-promise'], err => {
		t.fail();
	});
});

test('Promise usage', errorUsingBothCallbackAndPromiseCommandForSynchronousOperationFromSimpleCommandObjectMacro, (t, cli) => {
	t.plan(3);

	cli(['callback-promise']).then(()=>{
		t.fail();
	});
});