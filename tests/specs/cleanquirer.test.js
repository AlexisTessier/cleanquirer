'use strict';

const test = require('ava');

const fs = require('fs');
const path = require('path');

const pathFromIndex = require('../utils/path-from-index');
const requireFromIndex = require('../utils/require-from-index');

function featureHasTestFileMacro(t, testFilename) {
	t.plan(1);

	return new Promise(resolve => {
		fs.access(path.join(__dirname, '_cleanquirer', `${testFilename}.test.js`), err => {
			if (err) {t.fail(`The feature should be tested in a specific file. "${testFilename}" wasn't found (${err.message})`);}
			t.pass();
			resolve();
		});
	});
}

featureHasTestFileMacro.title = providedTitle => (
	`Feature has a test file - ${providedTitle}`)

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

/*---------------------------*/

test('Basic usage', featureHasTestFileMacro, 'basic-usage');
test('Basic usage > errors handling', featureHasTestFileMacro, 'basic-usage-errors-handling');

test('Command from file', featureHasTestFileMacro, 'command-from-file');
test('Command from file > errors handling', featureHasTestFileMacro, 'command-from-file-errors-handling');

test('Command from glob', featureHasTestFileMacro, 'command-from-glob');
test('Command from glob > errors handling', featureHasTestFileMacro, 'command-from-glob-errors-handling');

test('Mixed usages', featureHasTestFileMacro, 'mixed-usages');
test('Commands execution order', featureHasTestFileMacro, 'commands-execution-order');

test('Provide stdin, stout and stderr', featureHasTestFileMacro, 'stdin-stdout-stderr');
test('Provide a default version command', featureHasTestFileMacro, 'version-command');

test('Commands options support', featureHasTestFileMacro, 'command-options');

/*---------------------------*/

test.cb('acorn error should not happen - using set as key name in object pattern', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const cli = cleanquirer({
		name: 'mycli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/acorn-command-with-set-in-pattern-object')
		]
	});

	cli(['acorn-command-with-set-in-pattern-object']).then(value => {
		t.is(value, 'mock set value');
		t.end();
	});
});