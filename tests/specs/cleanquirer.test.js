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
test.skip('Command from glob > errors handling', featureHasTestFileMacro, 'command-from-glob-errors-handling');

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.todo('undefined command handling');
test.todo('version option');
test.todo('version command');

test.todo('Command definition from glob wrong cli input - synchronous usage');
test.todo('Command definition from glob wrong cli input - callback usage');
test.todo('Command definition from glob wrong cli input - promise usage');
test.todo('Command definition from glob with no doc');
test.todo('Command definition from glob mixed doc an no-doc');
test.todo('Command definition from glob with empty comment');
test.todo('Command definition from glob with doc');
test.todo('Command definition from glob with multiple comments');
test.todo('Command definition from glob with multiple functions without comments');
test.todo('Command definition from glob with multiple functions and some comments');
test.todo('Command definition from glob with multiple functions');
test.todo('Command definition from extensionless glob');
test.todo('Use a command from glob multiple times');
test.todo('Multiple commands definition from glob');
test.todo('Use commands from globs multiple times');

test.todo('Command definition from no-matching glob');
test.todo('Command definition from glob matching no js files');
test.todo('Command definition from glob synchronously throwing error');
test.todo('Command definition from glob synchronously callback without error');
test.todo('Command definition from glob synchronously callback with error');
test.todo('Command definition from glob internally using both callback and promise');
test.todo('Command definition from glob internally using both callback and promise and calling the callback');
test.todo('Command definition from glob internally using both callback and promise and calling the callback asynchronously');
test.todo('Command definition from glob asynchronously calling the callback with an error');
test.todo('Command definition from glob returning rejecting promise');

test.todo('Multiple commands definition from files and objects');
test.todo('Use commands from files and objects multiple times');

test.todo('Multiple commands definition from files and globs');
test.todo('Use commands from files and globs multiple times');

test.todo('Multiple commands definition from files, globs and objects');
test.todo('Use commands from files, globs and objects multiple times');

test.todo('Multiple commands definition from globs and objects');
test.todo('Use commands from globs and objects multiple times');

test.todo('Check the execution order of multiple commands defined from objects');
test.todo('Check the execution order of multiple commands defined from files');
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