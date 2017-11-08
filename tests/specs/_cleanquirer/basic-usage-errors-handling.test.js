'use strict';

const test = require('ava');

const msg = require('@alexistessier/msg');

const requireFromIndex = require('../../utils/require-from-index');

const mockFunction = require('../../mocks/mock-function');

/*---------------------------*/

function unvalidConfigMacro(t, unvalidConfig) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidConfigError = t.throws(()=>{
		cleanquirer(unvalidConfig);
	});

	if (unvalidConfig !== null) {
		t.is(unvalidConfigError.message, msg(
			`You must provide a valid configuration object to cleanquirer.`,
			`${typeof unvalidConfig} is not a valid type for a cleanquirer configuration.`
		));
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

function unvalidOptionsParameterMacro(t, unvalidOptionsParameter) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidOptionsParameterError = t.throws(()=>{
		cleanquirer({
			name: 'cli',
			options: unvalidOptionsParameter
		});
	});

	t.is(unvalidOptionsParameterError.message, `You must provide an object as options parameter for your cli tool.`);
}

unvalidOptionsParameterMacro.title = (providedTitle, data) => (
	`${providedTitle} - need an object as options parameter or throw an error with options object like ${JSON.stringify(data)}`);

/*---------------------------*/

function wrongCliInputMacro(t, wrongInput) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'mycli'
	});

	const wrongCliInputError = t.throws(()=>{
		myCli(wrongInput);
	});

	t.is(wrongCliInputError.message, msg(
		`When using mycli as a function, you must provide`,
		`an input to it as an Array like one from process.argv.slice(2).`
	));
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

	t.is(useCallbackInSynchronousWayError.message, msg(
		`The mycli command "callback" you are trying to use calls internally`,
		`a callback in a synchronous way. This is not permitted by cleanquirer.`,
		`If the command is synchronous, it shouldn't use neither callback or promise.`
	));
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

	t.is(useCallbackAndPromiseError.message, msg(
		`The myclii command "callback-promise" you are trying to use both uses`,
		`internally a callback and returns a promise. This is not permitted by cleanquirer.`,
		`If the command is asynchronous, it must use callback or promise but not both.`
	));
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

test(unvalidOptionsParameterMacro, null);
test(unvalidOptionsParameterMacro, '');
test(unvalidOptionsParameterMacro, []);
test(unvalidOptionsParameterMacro, 42);
test(unvalidOptionsParameterMacro, 'string');
test(unvalidOptionsParameterMacro, function(){ return; });

/*---------------------------*/

test('Error when defining command using an actionless command object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const emptyCommandObjectError = t.throws(() => {
		cleanquirer({
			name: 'cli-test',
			commands: [
				{
					name: 'actionless-command',
					action(){}
				},
				{
					name: 'actionless-command'
				}
			]
		})
	});

	t.is(emptyCommandObjectError.message, msg(
		`The provided cli-test command object at index 1`,
		`has no action defined. A valid action must be a function.`
	));
});

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

test('undefined command handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command-one',
				action: actionFunction,
			}
		]
	});

	t.is(actionFunction.callCount, 0);

	myCli(['command-one']);

	t.is(actionFunction.callCount, 1);

	const undefinedCommandError = t.throws(() => {
		myCli(['command-two']);
	});

	t.is(undefinedCommandError.message, 'The command "command-two" is not a command of "mycli".');
});

test('duplicate command handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const actionFunction = mockFunction();
	const actionFunctionBis = mockFunction();

	const duplicateCommandError = t.throws(() => {
		const myCli = cleanquirer({
			name: 'myclibis',
			commands: [
				{
					name: 'command-one',
					action: actionFunction,
				},
				{
					name: 'command-one',
					action: actionFunctionBis,
				}
			]
		});
	});

	t.is(duplicateCommandError.message, msg(
		`"myclibis" define a duplicate command "command-one"`,
		`in commands Array parameter at indexes 0 and 1.`
	));
});

/*---------------------------*/

function callbackCalledWithMoreThanOneValueMacro(t, excedentValues, core){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-multiple-callback',
		commands: [
			{
				name: 'callback-called-with-multiple-values',
				action(options, callback) {
					setTimeout(() => {
						callback(null, 'value-one', ...excedentValues);
					}, 20);
				}
			}
		]
	});

	core(t, myCli);
}

callbackCalledWithMoreThanOneValueMacro.title = providedTitle => (
	`Action with a callback called with more than one value - ${providedTitle}`);

const callbackCalledWithMoreThanOneValueErrorMessage = excedentValues => msg(
	`The cli-multiple-callback command "callback-called-with-multiple-values"`,
	`you are trying to use calls internally a callback with more than one value`,
	`(null, value-one, ${excedentValues}). This is not permitted by cleanquirer.`,
	`If the command uses a callback, it should only be called with a maximum of 2 arguments:`,
	`one error or null and one value eventually, like this: callback(err, 'a value').`
);

test.cb('Synchronous usage', callbackCalledWithMoreThanOneValueMacro, ['value-two'], async (t, myCli) => {
	t.plan(3)

	try{
		await myCli(['callback-called-with-multiple-values']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('value-two'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	t.end();
});

test.cb('Callback usage', callbackCalledWithMoreThanOneValueMacro, ['value-two', 'value-three'], (t, myCli) => {
	t.plan(3);

	myCli(['callback-called-with-multiple-values'], err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('value-two, value-three'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});

test.cb('Promise usage', callbackCalledWithMoreThanOneValueMacro, ['value-two', 'value-three', 'value-four'], (t, myCli) => {
	t.plan(3);

	myCli(['callback-called-with-multiple-values']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage('value-two, value-three, value-four'));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});

/*---------------------------*/

function callingCallbackWithAnUnvalidErrorMacro(t, unvalidError, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-unvalid-error-callback',
		commands: [
			{
				name: 'unvalid-error-callback',
				action(options, callback){
					setTimeout(()=>callback(unvalidError), 20);
				}
			}
		]
	});

	core(t, unvalidError, myCli);
}

callingCallbackWithAnUnvalidErrorMacro.title = (providedTitle, unvalidError) => (
	`Action with a callback called with an unvalid error (${unvalidError}) - ${providedTitle}`);

const unvalidErrorMessage = unvalidError => msg(
	`The cli-unvalid-error-callback command "unvalid-error-callback" you are trying to use`,
	`calls internally a callback with a unvalid error value: (${typeof unvalidError}) ${unvalidError}. If the command uses a callback,`,
	`the error parameter at first position can only be null or undefined if no error, or an instance of Error,`,
	`like this: callback(new Error("An error message")).`,
	`If the command is supposed to call the callback with a value, it must use the second argument like this:`,
	`callback(null, 'command result')`
);

const callingCallbackWithAnUnvalidErrorSynchronousCore = async(t, unvalidError, myCli) => {
	t.plan(3);

	try{
		await myCli(['unvalid-error-callback']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, unvalidErrorMessage(unvalidError));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	t.end();
}

const callingCallbackWithAnUnvalidErrorCallbackCore = async(t, unvalidError, myCli) => {
	t.plan(3);

	myCli(['unvalid-error-callback'], err => {
		t.true(err instanceof Error);
		t.is(err.message, unvalidErrorMessage(unvalidError));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
}

const callingCallbackWithAnUnvalidErrorPromiseCore = async(t, unvalidError, myCli) => {
	t.plan(3);

	myCli(['unvalid-error-callback']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, unvalidErrorMessage(unvalidError));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
}

test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, '', callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, ' ', callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, 'string', callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, 1, callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, 0, callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, [], callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, {}, callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, function(){return;}, callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, /regex/, callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, false, callingCallbackWithAnUnvalidErrorSynchronousCore);
test.cb('Synchronous usage', callingCallbackWithAnUnvalidErrorMacro, true, callingCallbackWithAnUnvalidErrorSynchronousCore);

test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, '', callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, ' ', callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, 'string', callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, 1, callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, 0, callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, [], callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, {}, callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, function(){return;}, callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, /regex/, callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, false, callingCallbackWithAnUnvalidErrorCallbackCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, true, callingCallbackWithAnUnvalidErrorCallbackCore);

test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, '', callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, ' ', callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, 'string', callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, 1, callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, 0, callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, [], callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, {}, callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, function(){return;}, callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, /regex/, callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, false, callingCallbackWithAnUnvalidErrorPromiseCore);
test.cb('Callback usage', callingCallbackWithAnUnvalidErrorMacro, true, callingCallbackWithAnUnvalidErrorPromiseCore);

/*-----------------------*/

test('Action with callback and returning a value', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'error-cli',
		commands: [
			{
				name: 'error',
				action(options, callback){
					return '';
				}
			}
		]
	});

	const callbackUsageWithAnActionReturningAValueError = t.throws(() => {
		myCli(['error']);
	});

	t.true(callbackUsageWithAnActionReturningAValueError instanceof Error);
	t.is(callbackUsageWithAnActionReturningAValueError.message, msg(
		`The error-cli command "error" you are trying to use both uses internally`,
		`a callback and returns a value () of type string. This is not permitted by cleanquirer.`,
		`If the command uses a callback, it must not return a value. Eventually, it can pass that`,
		`value as the second parameter of the callback like this: callback(null, resultValue)`
	));
	t.is(callbackUsageWithAnActionReturningAValueError.constructor.name, 'CleanquirerCommandImplementationError');
});