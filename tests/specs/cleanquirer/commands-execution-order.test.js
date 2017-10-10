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

test.todo('Check the execution order of multiple commands defined from objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from globs with multiple uses of commands');

test.todo('Check the execution order of multiple commands defined from files and objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files and globs with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files, globs and objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from globs and objects with multiple uses of commands');