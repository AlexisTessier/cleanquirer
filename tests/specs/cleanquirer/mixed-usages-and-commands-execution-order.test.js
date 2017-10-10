'use strict';

const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

const mockCommandFile = require('../../mocks/mock-command-file');
const mockFunction = require('../../mocks/mock-function');

let cleanquirerTestGetCallIndex = 0; 
global.cleanquirerTestGetCallIndex = () => (++cleanquirerTestGetCallIndex)

test('Multiple commands definition from files and objects', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFromObjectOne = mockFunction();
	const actionFromObjectTwo = mockFunction();

	const actionPathFromFileOne = await mockCommandFile('doc.js');
	const actionFromFileOne = require(actionPathFromFileOne);
	const actionPathFromFileTwo = await mockCommandFile('no-doc.js');
	const actionFromFileTwo = require(actionPathFromFileTwo);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command-object-one',
				action: actionFromObjectOne
			},
			actionPathFromFileOne,
			{
				name: 'command-object-two',
				action: actionFromObjectTwo
			},
			actionPathFromFileTwo
		]
	});

	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
});

test('Use commands from files and objects multiple times', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFromObjectOne = mockFunction();
	const actionFromObjectTwo = mockFunction();

	const actionPathFromFileOne = await mockCommandFile('doc.js');
	const actionFromFileOne = require(actionPathFromFileOne);
	const actionPathFromFileTwo = await mockCommandFile('no-doc.js');
	const actionFromFileTwo = require(actionPathFromFileTwo);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command-object-one',
				action: actionFromObjectOne
			},
			actionPathFromFileOne,
			{
				name: 'command-object-two',
				action: actionFromObjectTwo
			},
			actionPathFromFileTwo
		]
	});

	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileTwo.callCount, 0);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileTwo.callCount, 1);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
});

test('Multiple commands definition from files and globs', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromFileOne = await mockCommandFile('doc.js');
	const actionFromFileOne = require(actionPathFromFileOne);
	const actionPathFromFileTwo = await mockCommandFile('no-doc.js');
	const actionFromFileTwo = require(actionPathFromFileTwo);

	const actionGlob = pathFromIndex('tests/mocks/mock-commands/from-glob-mixed-usage/files-and-globs/simple/*')
	const actionFromGlobOne = require(actionGlob.replace('*', 'command'));
	const actionFromGlobTwo = require(actionGlob.replace('*', 'command-2'));

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			actionPathFromFileOne,
			actionPathFromFileTwo,
			actionGlob
		]
	});

	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-name']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['no-doc']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-command-2']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);
});

test('Use commands from files and globs multiple times', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromFileOne = await mockCommandFile('doc.js');
	const actionFromFileOne = require(actionPathFromFileOne);
	const actionPathFromFileTwo = await mockCommandFile('no-doc.js');
	const actionFromFileTwo = require(actionPathFromFileTwo);

	const actionGlob = pathFromIndex('tests/mocks/mock-commands/from-glob-mixed-usage/files-and-globs/multiple/*')
	const actionFromGlobOne = require(actionGlob.replace('*', 'command'));
	const actionFromGlobTwo = require(actionGlob.replace('*', 'command-2'));

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			actionPathFromFileOne,
			actionPathFromFileTwo,
			actionGlob
		]
	});

	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-name']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['no-doc']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-command-2']);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['doc-name']);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command']);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['no-doc']);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['doc-command-2']);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['doc-name']);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command']);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['no-doc']);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 3);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['doc-command-2']);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 3);
	t.is(actionFromGlobTwo.callCount, 3);
});

test('Multiple commands definition from globs and objects', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFromObjectOne = mockFunction();
	const actionFromObjectTwo = mockFunction();

	const actionGlob = pathFromIndex('tests/mocks/mock-commands/from-glob-mixed-usage/globs-and-objects/simple/*');
	const actionFromGlobOne = require(actionGlob.replace('*', 'command'));
	const actionFromGlobTwo = require(actionGlob.replace('*', 'command-2'));

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command-object-one',
				action: actionFromObjectOne
			},
			actionGlob,
			{
				name: 'command-object-two',
				action: actionFromObjectTwo
			}
		]
	});

	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);
});

test('Use commands from globs and objects multiple times', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFromObjectOne = mockFunction();
	const actionFromObjectTwo = mockFunction();

	const actionGlob = pathFromIndex('tests/mocks/mock-commands/from-glob-mixed-usage/globs-and-objects/multiple/*');
	const actionFromGlobOne = require(actionGlob.replace('*', 'command'));
	const actionFromGlobTwo = require(actionGlob.replace('*', 'command-2'));

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			{
				name: 'command-object-one',
				action: actionFromObjectOne
			},
			actionGlob,
			{
				name: 'command-object-two',
				action: actionFromObjectTwo
			}
		]
	});

	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromGlobTwo.callCount, 3);
});

test('Multiple commands definition from files, globs and objects', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFromObjectOne = mockFunction();
	const actionFromObjectTwo = mockFunction();

	const actionPathFromFileOne = await mockCommandFile('doc.js');
	const actionFromFileOne = require(actionPathFromFileOne);
	const actionPathFromFileTwo = await mockCommandFile('no-doc.js');
	const actionFromFileTwo = require(actionPathFromFileTwo);

	const actionGlob = pathFromIndex('tests/mocks/mock-commands/from-glob-mixed-usage/globs-files-and-objects/simple/*');
	const actionFromGlobOne = require(actionGlob.replace('*', 'command'));
	const actionFromGlobTwo = require(actionGlob.replace('*', 'command-2'));

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			actionPathFromFileOne,
			{
				name: 'command-object-one',
				action: actionFromObjectOne
			},
			actionGlob,
			{
				name: 'command-object-two',
				action: actionFromObjectTwo
			},
			actionPathFromFileTwo
		]
	});

	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);
});

test('Use commands from files, globs and objects multiple times', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionFromObjectOne = mockFunction();
	const actionFromObjectTwo = mockFunction();

	const actionPathFromFileOne = await mockCommandFile('doc.js');
	const actionFromFileOne = require(actionPathFromFileOne);
	const actionPathFromFileTwo = await mockCommandFile('no-doc.js');
	const actionFromFileTwo = require(actionPathFromFileTwo);

	const actionGlob = pathFromIndex('tests/mocks/mock-commands/from-glob-mixed-usage/globs-files-and-objects/multiple/*');
	const actionFromGlobOne = require(actionGlob.replace('*', 'command'));
	const actionFromGlobTwo = require(actionGlob.replace('*', 'command-2'));

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			actionPathFromFileOne,
			{
				name: 'command-object-one',
				action: actionFromObjectOne
			},
			actionGlob,
			{
				name: 'command-object-two',
				action: actionFromObjectTwo
			},
			actionPathFromFileTwo
		]
	});

	t.is(actionFromObjectOne.callCount, 0);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 0);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 0);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 0);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 0);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 0);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 1);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 1);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileOne.callCount, 1);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 1);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobOne.callCount, 1);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 1);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 2);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command-object-one']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 2);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command-object-two']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromFileOne.callCount, 2);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['doc-name']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 2);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['no-doc']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 3);
	t.is(actionFromGlobOne.callCount, 2);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['command']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromGlobTwo.callCount, 2);

	await myCli(['doc-command-2']);
	t.is(actionFromObjectOne.callCount, 3);
	t.is(actionFromObjectTwo.callCount, 3);
	t.is(actionFromFileOne.callCount, 3);
	t.is(actionFromFileTwo.callCount, 3);
	t.is(actionFromGlobOne.callCount, 3);
	t.is(actionFromGlobTwo.callCount, 3);
});

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

test.todo('Check the execution order of multiple commands defined from files, globs and objects');
test.todo('Check the execution order of multiple commands defined from globs and objects');

test.todo('Check the execution order of multiple commands defined from objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from globs with multiple uses of commands');

test.todo('Check the execution order of multiple commands defined from files and objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files and globs with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from files, globs and objects with multiple uses of commands');
test.todo('Check the execution order of multiple commands defined from globs and objects with multiple uses of commands');

test.todo('duplicate command handling');