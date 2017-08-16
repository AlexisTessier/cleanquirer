'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');
const pathFromIndex = require('../utils/path-from-index');

test('type and api', t => {
	const deduceFromIndex = requireFromIndex('deduce-command-object-from-file');
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	t.is(typeof deduce, 'function');
	t.is(deduceFromIndex, deduce);
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

function deduceNoFunctionModuleMacro(t, type, modulePath) {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	const fullModulePath = pathFromIndex('tests/mocks/mock-commands', modulePath);

	const noFunctionModuleError = t.throws(()=>{
		deduce(fullModulePath);
	});

	t.is(noFunctionModuleError.message, `${fullModulePath} exports ${type}. Valid commands module file must export a function`);
}

deduceNoFunctionModuleMacro.title = (providedTitle, modulePath, type) => (
	`${providedTitle} - error trying to deduce no function module - ${type} module`);

test(deduceNoFunctionModuleMacro, 'object', 'object-module.js');
test(deduceNoFunctionModuleMacro, 'object', 'array-module.js');
test(deduceNoFunctionModuleMacro, 'string', 'empty-string-module.js');
test(deduceNoFunctionModuleMacro, 'string', 'string-module.js');
test(deduceNoFunctionModuleMacro, 'undefined', 'undefined-module.js');
test(deduceNoFunctionModuleMacro, 'object', 'no-export-module.js');
test(deduceNoFunctionModuleMacro, 'null', 'null-module.js');
test(deduceNoFunctionModuleMacro, 'number', 'number-module.js');

/*------------------------*/

test.todo('error trying to deduce from a no javascript file');

/*------------------------*/

function deduceFromCommandFileMacro(t, commandFile, core) {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	const deducePromise = deduce(pathFromIndex('tests/mocks/mock-commands', commandFile));

	t.true(deducePromise instanceof Promise);

	return core ? core(t, deducePromise) : undefined;
}

deduceFromCommandFileMacro.title = providedTitle => (
	`deduce from command file - ${providedTitle}`);

test('return promise', deduceFromCommandFileMacro, 'no-doc.js');

test('deduce command name with no doc', deduceFromCommandFileMacro, 'no-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'no-doc');
	});
});

test('deduce command name with doc', deduceFromCommandFileMacro, 'doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'doc-name');
	});
});

test.todo('deduce command name from multi comments files');
test.todo('deduce command name from undocumented multi-functions files');
test.todo('deduce command name from documented multi-functions files');

test.todo('deduce command action with no doc');
test.todo('deduce command action with doc');
test.todo('deduce command action from multi comments files');
test.todo('deduce command action from undocumented multi-functions files');
test.todo('deduce command action from documented multi-functions files');