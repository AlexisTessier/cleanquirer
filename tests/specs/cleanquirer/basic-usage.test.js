'use strict';

const test = require('ava');

const requireFromIndex = require('../../utils/require-from-index');

const mockFunction = require('../../mocks/mock-function');

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
/*---------------------------*/
/*---------------------------*/

test('Synchronous usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	cli(['command']);

	t.true(action.calledOnce);
});

test.cb('Callback usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(2);

	cli(['command'], err => {
		t.is(err, null);

		t.true(action.calledOnce);

		t.end();
	});
});

test('Promise usage', synchronousCommandFromSimpleCommandObjectMacro, (t, cli, action) => {
	t.plan(2);

	const cliPromise = cli(['command']);

	t.true(cliPromise instanceof Promise);

	return cliPromise.then(() => {
		t.true(action.calledOnce);
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

test(`shouldn't modify the input Array when using commands from commands objects`, t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunctionOne = mockFunction();
	const actionFunctionTwo = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'one',
				action: actionFunctionOne
			},
			{
				name: 'two',
				action: actionFunctionTwo
			}
		]
	});

	const inputOne = ['one'];
	const inputTwo = ['two'];

	t.is(inputOne.length, 1);
	t.is(inputTwo.length, 1);

	myCli(inputOne);

	t.is(inputOne.length, 1);
	t.is(inputTwo.length, 1);

	myCli(inputTwo);

	t.is(inputOne.length, 1);
	t.is(inputTwo.length, 1);

	myCli(inputOne);

	t.is(inputOne.length, 1);
	t.is(inputTwo.length, 1);

	myCli(inputTwo);

	t.is(inputOne.length, 1);
	t.is(inputTwo.length, 1);
});

/*---------------------------*/

test('Use a command from object multiple times', t => {
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

	t.true(actionFunction.notCalled);

	myCli(['command']);
	t.true(actionFunction.calledOnce);

	myCli(['command']);
	t.true(actionFunction.calledTwice);

	myCli(['command']);
	t.true(actionFunction.calledThrice);
});

/*---------------------------*/

test('Multiple commands definition from objects', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction_1 = mockFunction();
	const actionFunction_2 = mockFunction();
	const actionFunction_3 = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'one',
				action(){
					actionFunction_1();
				}
			},
			{
				name: 'two',
				action(){
					actionFunction_2();
				}
			},
			{
				name: 'three',
				action(){
					actionFunction_3();
				}
			}
		]
	});

	t.true(actionFunction_1.notCalled);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['one']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['two']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.notCalled);

	myCli(['three']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.calledOnce);
});

/*---------------------------*/

test('Use commands from objects multiple times', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFunction_1 = mockFunction();
	const actionFunction_2 = mockFunction();
	const actionFunction_3 = mockFunction();

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'one',
				action(){
					actionFunction_1();
				}
			},
			{
				name: 'two',
				action(){
					actionFunction_2();
				}
			},
			{
				name: 'three',
				action(){
					actionFunction_3();
				}
			}
		]
	});

	t.true(actionFunction_1.notCalled);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['one']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.notCalled);
	t.true(actionFunction_3.notCalled);

	myCli(['two']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.notCalled);

	myCli(['three']);
	t.true(actionFunction_1.calledOnce);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.calledOnce);

	myCli(['one']);
	t.true(actionFunction_1.calledTwice);
	t.true(actionFunction_2.calledOnce);
	t.true(actionFunction_3.calledOnce);

	myCli(['two']);
	t.true(actionFunction_1.calledTwice);
	t.true(actionFunction_2.calledTwice);
	t.true(actionFunction_3.calledOnce);

	myCli(['three']);
	t.true(actionFunction_1.calledTwice);
	t.true(actionFunction_2.calledTwice);
	t.true(actionFunction_3.calledTwice);

	myCli(['one']);
	t.true(actionFunction_1.calledThrice);
	t.true(actionFunction_2.calledTwice);
	t.true(actionFunction_3.calledTwice);

	myCli(['two']);
	t.true(actionFunction_1.calledThrice);
	t.true(actionFunction_2.calledThrice);
	t.true(actionFunction_3.calledTwice);

	myCli(['three']);
	t.true(actionFunction_1.calledThrice);
	t.true(actionFunction_2.calledThrice);
	t.true(actionFunction_3.calledThrice);
});