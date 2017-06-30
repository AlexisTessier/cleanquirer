'use strict';

const test = require('ava');

const assert = require('assert');

const requireFromIndex = require('../utils/require-from-index');
const pathFromIndex = require('../utils/path-from-index');

test('type and api', t => {
	const deduceFromIndex = requireFromIndex('deduce-command-object-from-file');
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	assert.equal(typeof deduce, 'function');
	assert.equal(deduceFromIndex, deduce);
});

/*------------------------*/

function deduceWithWrongFilePathMacro(t, wrongFilePath) {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	const wrongFilePathError = t.throws(()=>{
		deduce(wrongFilePath);
	});

	t.is(wrongFilePathError.message, `${wrongFilePath} is of type ${typeof wrongFilePath}. The filepath argument must be an absolute path.`);
}

deduceWithWrongFilePathMacro.title = (providedTitle, wrongFilePath) => (
	`using with unvalid filepath argument - (${typeof wrongFilePath}) ${wrongFilePath}`);

test(deduceWithWrongFilePathMacro);
test(deduceWithWrongFilePathMacro, undefined);
test(deduceWithWrongFilePathMacro, null);
test(deduceWithWrongFilePathMacro, 5);
test(deduceWithWrongFilePathMacro, []);
test(deduceWithWrongFilePathMacro, {});
test(deduceWithWrongFilePathMacro, ()=>{});
test(deduceWithWrongFilePathMacro, '');
test(deduceWithWrongFilePathMacro, 'non/absolute/path.js');

/*------------------------*/

function deduceFromCommandFileMacro(t, commandFile, core) {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	const deducePromise = deduce(pathFromIndex('tests/mocks/mock-commands', commandFile));

	t.true(deducePromise instanceof Promise);

	return core ? core(t, deducePromise) : undefined;
}

deduceFromCommandFileMacro.title = providedTitle => (
	`deduce from command file - ${providedTitle}`);

test.todo('error trying to deduce no function module');
test.todo('error trying to deduce from a no javascript file');

test('return promise', deduceFromCommandFileMacro, 'no-doc.js');

test('deduce command name with no doc', deduceFromCommandFileMacro, 'no-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		assert.equal(typeof commandObject, 'object');
		assert.equal(commandObject.name, 'no-doc');
	});
});

test('deduce command name with doc', deduceFromCommandFileMacro, 'doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		assert.equal(typeof commandObject, 'object');
		assert.equal(commandObject.name, 'doc-name');
	});
});

test.todo('deduce command name from multi comments files');
test.todo('deduce command name from undocumented multi-functions files');
test.todo('deduce command name from documented multi-functions files');