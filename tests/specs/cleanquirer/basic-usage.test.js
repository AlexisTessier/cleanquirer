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
/*---------------------------*/
/*---------------------------*/

test('type and basic api', t => {
	const cleanquirerFromIndex = requireFromIndex('index');
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.is(cleanquirerFromIndex, cleanquirer);
	t.is(typeof cleanquirer, 'function');

	const myCli = cleanquirer({
		name: 'mycli'
	});

	t.is(typeof myCli, 'function');
});

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