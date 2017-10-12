'use strict';

const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

const mockFunction = require('../../mocks/mock-function');

let cleanquirerTestGetCallIndex = 0; 
global.cleanquirerTestGetCallIndex = () => (++cleanquirerTestGetCallIndex)

test('Check the execution order of multiple commands defined from objects', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionOne = mockFunction();
	const actionTwo = mockFunction();
	const actionThree = mockFunction();

	const myCli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'command-one',
				action: actionOne
			},
			{
				name: 'command-two',
				action: actionTwo
			},
			{
				name: 'command-three',
				action: actionThree
			}
		]
	});

	myCli(['command-two']);
	myCli(['command-three']);
	myCli(['command-one']);

	t.true(actionOne.calledAfter(actionThree));
	t.true(actionThree.calledAfter(actionTwo));
});

test('Check the execution order of multiple commands defined from objects with multiple uses of commands', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionOne = mockFunction();
	const actionTwo = mockFunction();
	const actionThree = mockFunction();

	const myCli = cleanquirer({
		name: 'cli-test',
		commands: [
			{
				name: 'command-one',
				action: actionOne
			},
			{
				name: 'command-two',
				action: actionTwo
			},
			{
				name: 'command-three',
				action: actionThree
			}
		]
	});

	myCli(['command-two']);
	myCli(['command-three']);
	myCli(['command-one']);

	t.true(actionOne.calledAfter(actionThree));
	t.true(actionThree.calledAfter(actionTwo));

	myCli(['command-three']);
	myCli(['command-two']);
	myCli(['command-one']);

	t.true(actionOne.calledAfter(actionTwo));
	t.true(actionTwo.calledAfter(actionThree));

	myCli(['command-one']);
	myCli(['command-two']);
	myCli(['command-three']);

	t.true(actionThree.calledAfter(actionTwo));
	t.true(actionTwo.calledAfter(actionOne));
});

/*-------------------------------------------*/

test('Check the execution order of multiple commands defined from files', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files/simple/normal-size-file.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files/simple/big-file.js');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files/simple/giant-file.js');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			actionPathFromTinyFile,
			actionPathFromBigFile,
			actionPathFromGiantFile
		]
	});

	await Promise.all([
		myCli(['giant-file']),
		myCli(['big-file']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);

	const tinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	const bigFileCallIndex = actionFromBigFile.callIndexes[0];
	const giantFileCallIndex = actionFromGiantFile.callIndexes[0];

	t.true(tinyFileCallIndex > bigFileCallIndex);
	t.true(bigFileCallIndex > giantFileCallIndex);
});

test('Check the execution order of multiple commands defined from files with multiple uses of commands', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files/multiple/normal-size-file.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files/multiple/big-file.js');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files/multiple/giant-file.js');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			actionPathFromTinyFile,
			actionPathFromBigFile,
			actionPathFromGiantFile
		]
	});

	await Promise.all([
		myCli(['giant-file']),
		myCli(['big-file']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);

	let tinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	let bigFileCallIndex = actionFromBigFile.callIndexes[0];
	let giantFileCallIndex = actionFromGiantFile.callIndexes[0];

	t.true(tinyFileCallIndex > bigFileCallIndex);
	t.true(bigFileCallIndex > giantFileCallIndex);

	await Promise.all([
		myCli(['big-file']),
		myCli(['giant-file']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 2);
	t.is(actionFromBigFile.callIndexes.length, 2);
	t.is(actionFromGiantFile.callIndexes.length, 2);

	tinyFileCallIndex = actionFromTinyFile.callIndexes[1];
	bigFileCallIndex = actionFromBigFile.callIndexes[1];
	giantFileCallIndex = actionFromGiantFile.callIndexes[1];

	t.true(tinyFileCallIndex > giantFileCallIndex);
	t.true(giantFileCallIndex > bigFileCallIndex);
});

/*-------------------------------------------*/

test('Check the execution order of multiple commands defined from globs', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const glob = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-glob/simple/*.js');

	const actionPathFromTinyFile = glob.replace('*', 'normal-size-file');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = glob.replace('*', 'big-file');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = glob.replace('*', 'giant-file');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			glob
		]
	});

	await Promise.all([
		myCli(['giant-file']),
		myCli(['big-file']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);

	const tinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	const bigFileCallIndex = actionFromBigFile.callIndexes[0];
	const giantFileCallIndex = actionFromGiantFile.callIndexes[0];

	t.true(tinyFileCallIndex > bigFileCallIndex);
	t.true(bigFileCallIndex > giantFileCallIndex);
});

test('Check the execution order of multiple commands defined from globs with multiple uses of commands', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const glob = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-glob/multiple/*.js');

	const actionPathFromTinyFile = glob.replace('*', 'normal-size-file');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = glob.replace('*', 'big-file');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = glob.replace('*', 'giant-file');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			glob
		]
	});

	await Promise.all([
		myCli(['big-file']),
		myCli(['giant-file']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);

	let tinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	let bigFileCallIndex = actionFromBigFile.callIndexes[0];
	let giantFileCallIndex = actionFromGiantFile.callIndexes[0];

	t.true(tinyFileCallIndex > giantFileCallIndex);
	t.true(giantFileCallIndex > bigFileCallIndex);

	await Promise.all([
		myCli(['big-file']),
		myCli(['normal-size-file-command']),
		myCli(['giant-file'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 2);
	t.is(actionFromBigFile.callIndexes.length, 2);
	t.is(actionFromGiantFile.callIndexes.length, 2);

	tinyFileCallIndex = actionFromTinyFile.callIndexes[1];
	bigFileCallIndex = actionFromBigFile.callIndexes[1];
	giantFileCallIndex = actionFromGiantFile.callIndexes[1];

	t.true(giantFileCallIndex > tinyFileCallIndex);
	t.true(tinyFileCallIndex > bigFileCallIndex);
});

/*-------------------------------------------*/

test('Check the execution order of multiple commands defined from files and objects', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-objects/simple/normal-size-file.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-objects/simple/big-file.js');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-objects/simple/giant-file.js');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const actionFromObjectOne = mockFunction.usingCallIndexes();
	const actionFromObjectTwo = mockFunction.usingCallIndexes();
	const actionFromObjectThree = mockFunction.usingCallIndexes();

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			actionPathFromTinyFile,
			{
				name: 'command-one',
				action: actionFromObjectOne
			},
			actionPathFromBigFile,
			actionPathFromGiantFile,
			{
				name: 'command-three',
				action: actionFromObjectThree
			},
			{
				name: 'command-two',
				action: actionFromObjectTwo
			}
		]
	});

	await Promise.all([
		myCli(['command-one']),
		myCli(['giant-file']),
		myCli(['command-two']),
		myCli(['big-file']),
		myCli(['command-three']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromObjectOne.callIndexes.length, 1);
	t.is(actionFromObjectTwo.callIndexes.length, 1);
	t.is(actionFromObjectThree.callIndexes.length, 1);
	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);

	const commandOneCallIndex = actionFromObjectOne.callIndexes[0];
	const commandTwoCallIndex = actionFromObjectTwo.callIndexes[0];
	const commandThreeCallIndex = actionFromObjectThree.callIndexes[0];
	const tinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	const bigFileCallIndex = actionFromBigFile.callIndexes[0];
	const giantFileCallIndex = actionFromGiantFile.callIndexes[0];

	t.true(tinyFileCallIndex > commandThreeCallIndex);
	t.true(commandThreeCallIndex > bigFileCallIndex);
	t.true(bigFileCallIndex > commandTwoCallIndex);
	t.true(commandTwoCallIndex > giantFileCallIndex);
	t.true(giantFileCallIndex > commandOneCallIndex);
});

test.todo('Check the execution order of multiple commands defined from files and objects with multiple uses of commands');

/*-------------------------------------------*/

test('Check the execution order of multiple commands defined from files and globs', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-glob--files/simple/normal-size-file.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-glob--files/simple/big-file.js');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-glob--files/simple/giant-file.js');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const glob = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-and-glob--glob/simple/*.js');

	const actionPathFromTinyFileGlob = glob.replace('*', 'normal-size-file');
	const actionFromTinyFileGlob = require(actionPathFromTinyFileGlob);

	const actionPathFromBigFileGlob = glob.replace('*', 'big-file');
	const actionFromBigFileGlob = require(actionPathFromBigFileGlob);

	const actionPathFromGiantFileGlob = glob.replace('*', 'giant-file');
	const actionFromGiantFileGlob = require(actionPathFromGiantFileGlob);

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			actionPathFromTinyFile,
			actionPathFromBigFile,
			actionPathFromGiantFile,
			glob
		]
	});

	await Promise.all([
		myCli(['giant-file-glob']),
		myCli(['big-file']),
		myCli(['normal-size-file-glob']),
		myCli(['giant-file']),
		myCli(['big-file-glob']),
		myCli(['normal-size-file'])
	]);

	t.is(actionFromTinyFileGlob.callIndexes.length, 1);
	t.is(actionFromBigFileGlob.callIndexes.length, 1);
	t.is(actionFromGiantFileGlob.callIndexes.length, 1);
	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);

	const tinyFileGlobCallIndex = actionFromTinyFileGlob.callIndexes[0];
	const bigFileGlobCallIndex = actionFromBigFileGlob.callIndexes[0];
	const giantFileGlobCallIndex = actionFromGiantFileGlob.callIndexes[0];
	const tinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	const bigFileCallIndex = actionFromBigFile.callIndexes[0];
	const giantFileCallIndex = actionFromGiantFile.callIndexes[0];

	t.true(tinyFileCallIndex > bigFileGlobCallIndex);
	t.true(bigFileGlobCallIndex > giantFileCallIndex);
	t.true(giantFileCallIndex > tinyFileGlobCallIndex);
	t.true(tinyFileGlobCallIndex > bigFileCallIndex);
	t.true(bigFileCallIndex > giantFileGlobCallIndex);
});

test.todo('Check the execution order of multiple commands defined from files and globs with multiple uses of commands');

/*-------------------------------------------*/

test('Check the execution order of multiple commands defined from globs and objects', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const glob = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-glob-and-objects/simple/*.js');

	const actionPathFromTinyFileGlob = glob.replace('*', 'normal-size-file');
	const actionFromTinyFileGlob = require(actionPathFromTinyFileGlob);

	const actionPathFromBigFileGlob = glob.replace('*', 'big-file');
	const actionFromBigFileGlob = require(actionPathFromBigFileGlob);

	const actionPathFromGiantFileGlob = glob.replace('*', 'giant-file');
	const actionFromGiantFileGlob = require(actionPathFromGiantFileGlob);

	const actionFromObjectOne = mockFunction.usingCallIndexes();
	const actionFromObjectTwo = mockFunction.usingCallIndexes();
	const actionFromObjectThree = mockFunction.usingCallIndexes();

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			{
				name: 'command-one',
				action: actionFromObjectOne
			},
			glob,
			{
				name: 'command-three',
				action: actionFromObjectThree
			},
			{
				name: 'command-two',
				action: actionFromObjectTwo
			}
		]
	});

	await Promise.all([
		myCli(['command-one']),
		myCli(['giant-file']),
		myCli(['command-two']),
		myCli(['big-file']),
		myCli(['command-three']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFileGlob.callIndexes.length, 1);
	t.is(actionFromBigFileGlob.callIndexes.length, 1);
	t.is(actionFromGiantFileGlob.callIndexes.length, 1);
	t.is(actionFromObjectOne.callIndexes.length, 1);
	t.is(actionFromObjectTwo.callIndexes.length, 1);
	t.is(actionFromObjectThree.callIndexes.length, 1);

	const tinyFileGlobCallIndex = actionFromTinyFileGlob.callIndexes[0];
	const bigFileGlobCallIndex = actionFromBigFileGlob.callIndexes[0];
	const giantFileGlobCallIndex = actionFromGiantFileGlob.callIndexes[0];
	const actionFromObjectOneCallIndex = actionFromObjectOne.callIndexes[0];
	const actionFromObjectTwoCallIndex = actionFromObjectTwo.callIndexes[0];
	const actionFromObjectThreeCallIndex = actionFromObjectThree.callIndexes[0];

	t.true(tinyFileGlobCallIndex > actionFromObjectThreeCallIndex);
	t.true(actionFromObjectThreeCallIndex > bigFileGlobCallIndex);
	t.true(bigFileGlobCallIndex > actionFromObjectTwoCallIndex);
	t.true(actionFromObjectTwoCallIndex > giantFileGlobCallIndex);
	t.true(giantFileGlobCallIndex > actionFromObjectOneCallIndex);
});

test('Check the execution order of multiple commands defined from globs and objects with multiple uses of commands', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const glob = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-glob-and-objects/multiple/*.js');

	const actionPathFromTinyFileGlob = glob.replace('*', 'normal-size-file');
	const actionFromTinyFileGlob = require(actionPathFromTinyFileGlob);

	const actionPathFromBigFileGlob = glob.replace('*', 'big-file');
	const actionFromBigFileGlob = require(actionPathFromBigFileGlob);

	const actionPathFromGiantFileGlob = glob.replace('*', 'giant-file');
	const actionFromGiantFileGlob = require(actionPathFromGiantFileGlob);

	const actionFromObjectOne = mockFunction.usingCallIndexes();
	const actionFromObjectTwo = mockFunction.usingCallIndexes();
	const actionFromObjectThree = mockFunction.usingCallIndexes();

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			glob,
			{
				name: 'command-one',
				action: actionFromObjectOne
			},
			{
				name: 'command-three',
				action: actionFromObjectThree
			},
			{
				name: 'command-two',
				action: actionFromObjectTwo
			}
		]
	});

	await Promise.all([
		myCli(['command-two']),
		myCli(['big-file']),
		myCli(['command-one']),
		myCli(['giant-file']),
		myCli(['command-three']),
		myCli(['normal-size-file-command'])
	]);

	t.is(actionFromTinyFileGlob.callIndexes.length, 1);
	t.is(actionFromBigFileGlob.callIndexes.length, 1);
	t.is(actionFromGiantFileGlob.callIndexes.length, 1);
	t.is(actionFromObjectOne.callIndexes.length, 1);
	t.is(actionFromObjectTwo.callIndexes.length, 1);
	t.is(actionFromObjectThree.callIndexes.length, 1);

	let tinyFileGlobCallIndex = actionFromTinyFileGlob.callIndexes[0];
	let bigFileGlobCallIndex = actionFromBigFileGlob.callIndexes[0];
	let giantFileGlobCallIndex = actionFromGiantFileGlob.callIndexes[0];
	let actionFromObjectOneCallIndex = actionFromObjectOne.callIndexes[0];
	let actionFromObjectTwoCallIndex = actionFromObjectTwo.callIndexes[0];
	let actionFromObjectThreeCallIndex = actionFromObjectThree.callIndexes[0];

	t.true(tinyFileGlobCallIndex > actionFromObjectThreeCallIndex);
	t.true(actionFromObjectThreeCallIndex > giantFileGlobCallIndex);
	t.true(giantFileGlobCallIndex > actionFromObjectOneCallIndex);
	t.true(actionFromObjectOneCallIndex > bigFileGlobCallIndex);
	t.true(bigFileGlobCallIndex > actionFromObjectTwoCallIndex);

	await Promise.all([
		myCli(['giant-file']),
		myCli(['normal-size-file-command']),
		myCli(['command-two']),
		myCli(['big-file']),
		myCli(['command-one']),
		myCli(['command-three'])
	]);

	t.is(actionFromTinyFileGlob.callIndexes.length, 2);
	t.is(actionFromBigFileGlob.callIndexes.length, 2);
	t.is(actionFromGiantFileGlob.callIndexes.length, 2);
	t.is(actionFromObjectOne.callIndexes.length, 2);
	t.is(actionFromObjectTwo.callIndexes.length, 2);
	t.is(actionFromObjectThree.callIndexes.length, 2);

	tinyFileGlobCallIndex = actionFromTinyFileGlob.callIndexes[1];
	bigFileGlobCallIndex = actionFromBigFileGlob.callIndexes[1];
	giantFileGlobCallIndex = actionFromGiantFileGlob.callIndexes[1];
	actionFromObjectOneCallIndex = actionFromObjectOne.callIndexes[1];
	actionFromObjectTwoCallIndex = actionFromObjectTwo.callIndexes[1];
	actionFromObjectThreeCallIndex = actionFromObjectThree.callIndexes[1];

	t.true(actionFromObjectThreeCallIndex > actionFromObjectOneCallIndex);
	t.true(actionFromObjectOneCallIndex > bigFileGlobCallIndex);
	t.true(bigFileGlobCallIndex > actionFromObjectTwoCallIndex);
	t.true(actionFromObjectTwoCallIndex > tinyFileGlobCallIndex);
	t.true(tinyFileGlobCallIndex > giantFileGlobCallIndex);
});

/*-------------------------------------------*/

test('Check the execution order of multiple commands defined from files, globs and objects', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--files/simple/normal-size-file.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--files/simple/big-file.js');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--files/simple/giant-file.js');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const globOne = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--globs/glob-one/*.js');
	const globTwo = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--globs/glob-two/*.js');

	const actionPathFromGlobOne = globOne.replace('*', 'one');
	const actionFromGlobOne = require(actionPathFromGlobOne);

	const actionPathFromGlobTwo = globOne.replace('*', 'two');
	const actionFromGlobTwo = require(actionPathFromGlobTwo);

	const actionPathFromGlobThree = globTwo.replace('*', 'three');
	const actionFromGlobThree = require(actionPathFromGlobThree);

	const actionPathFromGlobFour = globOne.replace('*', 'four');
	const actionFromGlobFour = require(actionPathFromGlobFour);

	const actionPathFromGlobFive = globTwo.replace('*', 'five');
	const actionFromGlobFive = require(actionPathFromGlobFive);

	const actionPathFromGlobSix = globTwo.replace('*', 'six');
	const actionFromGlobSix = require(actionPathFromGlobSix);

	const actionFromObjectOne = mockFunction.usingCallIndexes();
	const actionFromObjectTwo = mockFunction.usingCallIndexes();
	const actionFromObjectThree = mockFunction.usingCallIndexes();

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			actionPathFromGiantFile,
			{
				name: 'o-one',
				action: actionFromObjectOne
			},
			globOne,
			{
				name: 'o-three',
				action: actionFromObjectThree
			},
			globTwo,
			actionPathFromTinyFile,
			{
				name: 'o-two',
				action: actionFromObjectTwo
			},
			actionPathFromBigFile
		]
	});

	await Promise.all([
		myCli(['one']),
		myCli(['two']),
		myCli(['o-one']),
		myCli(['three']),
		myCli(['giant-file']),
		myCli(['o-two']),
		myCli(['big-file']),
		myCli(['five']),
		myCli(['four']),
		myCli(['normal-size-file']),
		myCli(['six']),
		myCli(['o-three']),
	]);

	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);
	t.is(actionFromGlobOne.callIndexes.length, 1);
	t.is(actionFromGlobTwo.callIndexes.length, 1);
	t.is(actionFromGlobThree.callIndexes.length, 1);
	t.is(actionFromGlobFour.callIndexes.length, 1);
	t.is(actionFromGlobFive.callIndexes.length, 1);
	t.is(actionFromGlobSix.callIndexes.length, 1);
	t.is(actionFromObjectOne.callIndexes.length, 1);
	t.is(actionFromObjectTwo.callIndexes.length, 1);
	t.is(actionFromObjectThree.callIndexes.length, 1);

	const actionFromTinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	const actionFromBigFileCallIndex = actionFromBigFile.callIndexes[0];
	const actionFromGiantFileCallIndex = actionFromGiantFile.callIndexes[0];
	const actionFromGlobOneCallIndex = actionFromGlobOne.callIndexes[0];
	const actionFromGlobTwoCallIndex = actionFromGlobTwo.callIndexes[0];
	const actionFromGlobThreeCallIndex = actionFromGlobThree.callIndexes[0];
	const actionFromGlobFourCallIndex = actionFromGlobFour.callIndexes[0];
	const actionFromGlobFiveCallIndex = actionFromGlobFive.callIndexes[0];
	const actionFromGlobSixCallIndex = actionFromGlobSix.callIndexes[0];
	const actionFromObjectOneCallIndex = actionFromObjectOne.callIndexes[0];
	const actionFromObjectTwoCallIndex = actionFromObjectTwo.callIndexes[0];
	const actionFromObjectThreeCallIndex = actionFromObjectThree.callIndexes[0];

	t.true(actionFromObjectThreeCallIndex > actionFromGlobSixCallIndex);
	t.true(actionFromGlobSixCallIndex > actionFromTinyFileCallIndex);
	t.true(actionFromTinyFileCallIndex > actionFromGlobFourCallIndex);
	t.true(actionFromGlobFourCallIndex > actionFromGlobFiveCallIndex);
	t.true(actionFromGlobFiveCallIndex > actionFromBigFileCallIndex);
	t.true(actionFromBigFileCallIndex > actionFromObjectTwoCallIndex);
	t.true(actionFromObjectTwoCallIndex > actionFromGiantFileCallIndex);
	t.true(actionFromGiantFileCallIndex > actionFromGlobThreeCallIndex);
	t.true(actionFromGlobThreeCallIndex > actionFromObjectOneCallIndex);
	t.true(actionFromObjectOneCallIndex > actionFromGlobTwoCallIndex);
	t.true(actionFromGlobTwoCallIndex > actionFromGlobOneCallIndex);
});

test('Check the execution order of multiple commands defined from files, globs and objects with multiple uses of commands', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--files/multiple/normal-size-file.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	const actionPathFromBigFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--files/multiple/big-file.js');
	const actionFromBigFile = require(actionPathFromBigFile);

	const actionPathFromGiantFile = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--files/multiple/giant-file.js');
	const actionFromGiantFile = require(actionPathFromGiantFile);

	const globOne = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--globs/glob-one-multiple/*.js');
	const globTwo = pathFromIndex('tests/mocks/mock-commands/execution-order-tests/from-files-globs-and-objects--globs/glob-two-multiple/*.js');

	const actionPathFromGlobOne = globOne.replace('*', 'one');
	const actionFromGlobOne = require(actionPathFromGlobOne);

	const actionPathFromGlobTwo = globOne.replace('*', 'two');
	const actionFromGlobTwo = require(actionPathFromGlobTwo);

	const actionPathFromGlobThree = globTwo.replace('*', 'three');
	const actionFromGlobThree = require(actionPathFromGlobThree);

	const actionPathFromGlobFour = globOne.replace('*', 'four');
	const actionFromGlobFour = require(actionPathFromGlobFour);

	const actionPathFromGlobFive = globTwo.replace('*', 'five');
	const actionFromGlobFive = require(actionPathFromGlobFive);

	const actionPathFromGlobSix = globTwo.replace('*', 'six');
	const actionFromGlobSix = require(actionPathFromGlobSix);

	const actionFromObjectOne = mockFunction.usingCallIndexes();
	const actionFromObjectTwo = mockFunction.usingCallIndexes();
	const actionFromObjectThree = mockFunction.usingCallIndexes();

	const myCli = cleanquirer({
		name: 'cli',
		commands: [
			actionPathFromBigFile,
			actionPathFromGiantFile,
			globOne,
			{
				name: 'o-three',
				action: actionFromObjectThree
			},
			globTwo,
			{
				name: 'o-one',
				action: actionFromObjectOne
			},
			actionPathFromTinyFile,
			{
				name: 'o-two',
				action: actionFromObjectTwo
			}
		]
	});

	await Promise.all([
		myCli(['one']),
		myCli(['o-one']),
		myCli(['three']),
		myCli(['giant-file']),
		myCli(['o-two']),
		myCli(['two']),
		myCli(['normal-size-file']),
		myCli(['six']),
		myCli(['o-three']),
		myCli(['big-file']),
		myCli(['five']),
		myCli(['four'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 1);
	t.is(actionFromBigFile.callIndexes.length, 1);
	t.is(actionFromGiantFile.callIndexes.length, 1);
	t.is(actionFromGlobOne.callIndexes.length, 1);
	t.is(actionFromGlobTwo.callIndexes.length, 1);
	t.is(actionFromGlobThree.callIndexes.length, 1);
	t.is(actionFromGlobFour.callIndexes.length, 1);
	t.is(actionFromGlobFive.callIndexes.length, 1);
	t.is(actionFromGlobSix.callIndexes.length, 1);
	t.is(actionFromObjectOne.callIndexes.length, 1);
	t.is(actionFromObjectTwo.callIndexes.length, 1);
	t.is(actionFromObjectThree.callIndexes.length, 1);

	let actionFromTinyFileCallIndex = actionFromTinyFile.callIndexes[0];
	let actionFromBigFileCallIndex = actionFromBigFile.callIndexes[0];
	let actionFromGiantFileCallIndex = actionFromGiantFile.callIndexes[0];
	let actionFromGlobOneCallIndex = actionFromGlobOne.callIndexes[0];
	let actionFromGlobTwoCallIndex = actionFromGlobTwo.callIndexes[0];
	let actionFromGlobThreeCallIndex = actionFromGlobThree.callIndexes[0];
	let actionFromGlobFourCallIndex = actionFromGlobFour.callIndexes[0];
	let actionFromGlobFiveCallIndex = actionFromGlobFive.callIndexes[0];
	let actionFromGlobSixCallIndex = actionFromGlobSix.callIndexes[0];
	let actionFromObjectOneCallIndex = actionFromObjectOne.callIndexes[0];
	let actionFromObjectTwoCallIndex = actionFromObjectTwo.callIndexes[0];
	let actionFromObjectThreeCallIndex = actionFromObjectThree.callIndexes[0];

	t.true(actionFromGlobFourCallIndex > actionFromGlobFiveCallIndex);
	t.true(actionFromGlobFiveCallIndex > actionFromBigFileCallIndex);
	t.true(actionFromBigFileCallIndex > actionFromObjectThreeCallIndex);
	t.true(actionFromObjectThreeCallIndex > actionFromGlobSixCallIndex);
	t.true(actionFromGlobSixCallIndex > actionFromTinyFileCallIndex);
	t.true(actionFromTinyFileCallIndex > actionFromGlobTwoCallIndex);
	t.true(actionFromGlobTwoCallIndex > actionFromObjectTwoCallIndex);
	t.true(actionFromObjectTwoCallIndex > actionFromGiantFileCallIndex);
	t.true(actionFromGiantFileCallIndex > actionFromGlobThreeCallIndex);
	t.true(actionFromGlobThreeCallIndex > actionFromObjectOneCallIndex);
	t.true(actionFromObjectOneCallIndex > actionFromGlobOneCallIndex);

	await Promise.all([
		myCli(['giant-file']),
		myCli(['one']),
		myCli(['normal-size-file']),
		myCli(['six']),
		myCli(['five']),
		myCli(['three']),
		myCli(['o-two']),
		myCli(['o-three']),
		myCli(['big-file']),
		myCli(['two']),
		myCli(['o-one']),
		myCli(['four'])
	]);

	t.is(actionFromTinyFile.callIndexes.length, 2);
	t.is(actionFromBigFile.callIndexes.length, 2);
	t.is(actionFromGiantFile.callIndexes.length, 2);
	t.is(actionFromGlobOne.callIndexes.length, 2);
	t.is(actionFromGlobTwo.callIndexes.length, 2);
	t.is(actionFromGlobThree.callIndexes.length, 2);
	t.is(actionFromGlobFour.callIndexes.length, 2);
	t.is(actionFromGlobFive.callIndexes.length, 2);
	t.is(actionFromGlobSix.callIndexes.length, 2);
	t.is(actionFromObjectOne.callIndexes.length, 2);
	t.is(actionFromObjectTwo.callIndexes.length, 2);
	t.is(actionFromObjectThree.callIndexes.length, 2);

	actionFromTinyFileCallIndex = actionFromTinyFile.callIndexes[1];
	actionFromBigFileCallIndex = actionFromBigFile.callIndexes[1];
	actionFromGiantFileCallIndex = actionFromGiantFile.callIndexes[1];
	actionFromGlobOneCallIndex = actionFromGlobOne.callIndexes[1];
	actionFromGlobTwoCallIndex = actionFromGlobTwo.callIndexes[1];
	actionFromGlobThreeCallIndex = actionFromGlobThree.callIndexes[1];
	actionFromGlobFourCallIndex = actionFromGlobFour.callIndexes[1];
	actionFromGlobFiveCallIndex = actionFromGlobFive.callIndexes[1];
	actionFromGlobSixCallIndex = actionFromGlobSix.callIndexes[1];
	actionFromObjectOneCallIndex = actionFromObjectOne.callIndexes[1];
	actionFromObjectTwoCallIndex = actionFromObjectTwo.callIndexes[1];
	actionFromObjectThreeCallIndex = actionFromObjectThree.callIndexes[1];

	t.true(actionFromGlobFourCallIndex > actionFromObjectOneCallIndex);
	t.true(actionFromObjectOneCallIndex > actionFromGlobTwoCallIndex);
	t.true(actionFromGlobTwoCallIndex > actionFromBigFileCallIndex);
	t.true(actionFromBigFileCallIndex > actionFromObjectThreeCallIndex);
	t.true(actionFromObjectThreeCallIndex > actionFromObjectTwoCallIndex);
	t.true(actionFromObjectTwoCallIndex > actionFromGlobThreeCallIndex);
	t.true(actionFromGlobThreeCallIndex > actionFromGlobFiveCallIndex);
	t.true(actionFromGlobFiveCallIndex > actionFromGlobSixCallIndex);
	t.true(actionFromGlobSixCallIndex > actionFromTinyFileCallIndex);
	t.true(actionFromTinyFileCallIndex > actionFromGlobOneCallIndex);
	t.true(actionFromGlobOneCallIndex > actionFromGiantFileCallIndex);
});