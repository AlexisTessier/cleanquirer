'use strict';

const test = require('ava');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

const mockCommandFile = require('../../mocks/mock-command-file');
const mockFunction = require('../../mocks/mock-function');

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
	const actionBis = mockFunction();

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
				name: 'command-bis',
				action: actionBis
			}
		]
	});

	myCli(['command-two']);
	myCli(['command-bis']);
	myCli(['command-one']);

	t.true(actionOne.calledAfter(actionBis));
	t.true(actionBis.calledAfter(actionTwo));
});

test.skip('Check the execution order of multiple commands defined from files', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const actionPathFromTinyFile = await mockCommandFile('doc.js');
	const actionFromTinyFile = require(actionPathFromTinyFile);

	// const actionPathFromBigFile = await mockCommandFile('big-file.js');
	// const actionFromBigFile = require(actionPathFromBigFile);

	// const actionPathFromGiantFile = await mockCommandFile('giant-file.js');
	// const actionFromGiantFile = require(actionPathFromGiantFile);
});
test.todo('Check the execution order of multiple commands defined from globs');

test.todo('Check the execution order of multiple commands defined from files and objects');
test.todo('Check the execution order of multiple commands defined from files and globs');
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