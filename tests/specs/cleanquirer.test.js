'use strict';

const test = require('ava');

const fs = require('fs');
const path = require('path');

const requireFromIndex = require('../utils/require-from-index');

function featureHasTestFileMacro(t, testFilename) {
	t.plan(1);

	return new Promise(resolve => {
		fs.access(path.join(__dirname, 'cleanquirer', `${testFilename}.test.js`), err => {
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

test('Mixed usages and commands execution order', featureHasTestFileMacro, 'mixed-usages-and-commands-execution-order');

/*---------------------------*/

test.todo('stdout');
test.todo('stderr');
test.todo('default stdout handling');
test.todo('default stderr handling');
test.todo('custom stdout handling');
test.todo('custom stderr handling');

test.todo('version option');
test.todo('default version option');
test.todo('version command');