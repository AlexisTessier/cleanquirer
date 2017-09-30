'use strict';

const test = require('ava');

const requireFromIndex = require('../utils/require-from-index');
const pathFromIndex = require('../utils/path-from-index');

const msg = requireFromIndex('sources/msg');

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

	t.is(noFunctionModuleError.message, `${fullModulePath} exports ${type}. A valid command module file must export a function.`);
}

deduceNoFunctionModuleMacro.title = (providedTitle, type, modulePath) => (
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

function deduceNoJsFileMacro(t, wrongFile, errorMessageStart) {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	const noJsFilePath = pathFromIndex('tests/mocks/mock-commands', wrongFile);

	const noJsFileError = t.throws(()=>{
		deduce(noJsFilePath);
	});

	t.is(noJsFileError.message, `"${noJsFilePath}" ${errorMessageStart}. A valid command module file must be a javascript file (.js).`);
}

test('error trying to deduce from a no js file', deduceNoJsFileMacro, 'no-js.txt', 'is a .txt file');
test('error trying to deduce from a no js file and skipping the extension', deduceNoJsFileMacro, 'no-js', 'has no extension');

/*------------------------*/

test('deduce from a syntax error file', t => {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	const syntaxErrorFilePath = pathFromIndex('tests/mocks/mock-commands/syntax-error.js');
	const syntaxErrorFileError = t.throws(()=>{
		deduce(syntaxErrorFilePath);
	});

	t.is(syntaxErrorFileError.message, `Error with the file at path "${syntaxErrorFilePath}": Invalid or unexpected token`);
});

test('deduce from an unhandled exports definition file', t => {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/unhandled-exports-file.js');

	return deduce(fullPath).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(err.message, `Cleanquirer doesn't found any exports node in the file "${fullPath}".`);
	});
});

test('deduce from an unhandled exports type file', t => {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/unhandled-exports-type-file.js');

	return deduce(fullPath).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(err.message, `The file "${fullPath}" exports a node of type FunctionExpression. This type of exports is not handled by cleanquirer.`);
	});
});

test('deduce from an unhandled exports value origin file', t => {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/unhandled-exports-value-origin-file.js');

	return deduce(fullPath).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(err.message, `Cleanquirer doesn\'t found the exports value node in the file "${fullPath}".`);
	});
});

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
test('return promise skipping the file extension', deduceFromCommandFileMacro, 'no-doc');

/*-------------------------------------*/

test('deduce command name with no doc', deduceFromCommandFileMacro, 'no-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'no-doc');
	});
});

test('deduce command name from empty comment doc', deduceFromCommandFileMacro, 'empty-comment-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'empty-comment-doc');
	});
});

test('deduce command name with doc', deduceFromCommandFileMacro, 'doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'doc-name');
	});
});

test('deduce command name from multi comments files', deduceFromCommandFileMacro, 'multi-comments.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'multi-comments-name');
	});
});

test('deduce command name from multi top comments files', deduceFromCommandFileMacro, 'multi-top-comments.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'multi-comments-name');
	});
});

test('deduce command name from undocumented multi-functions files', deduceFromCommandFileMacro, 'multi-functions-file-no-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'multi-functions-file-no-doc');
	});
});

test('deduce command name from undocumented multi-functions files (mixed with documented functions)', deduceFromCommandFileMacro, 'multi-functions-file-no-doc-mixed.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'multi-functions-file-no-doc-mixed');
	});
});

test('deduce command name from documented multi-functions files', deduceFromCommandFileMacro, 'multi-functions-file.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.name, 'main-doc-name');
	});
});

/*-------------------------------------*/

test('deduce command action with no doc', deduceFromCommandFileMacro, 'no-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/no-doc.js'));
	});
});

test('deduce command action with doc', deduceFromCommandFileMacro, 'doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/doc.js'));
	});
});

test('deduce command action from multi comments files', deduceFromCommandFileMacro, 'multi-comments.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/multi-comments.js'));
	});
});

test('deduce command action from multi top comments files', deduceFromCommandFileMacro, 'multi-top-comments.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/multi-top-comments.js'));
	});
});

test('deduce command action from undocumented multi-functions files', deduceFromCommandFileMacro, 'multi-functions-file-no-doc.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/multi-functions-file-no-doc.js'));
	});
});

test('deduce command action from undocumented multi-functions files (mixed with documented functions)', deduceFromCommandFileMacro, 'multi-functions-file-no-doc-mixed.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/multi-functions-file-no-doc-mixed.js'));
	});
});

test('deduce command action from documented multi-functions files', deduceFromCommandFileMacro, 'multi-functions-file.js', (t, deduce) => {
	return deduce.then(commandObject => {
		t.is(typeof commandObject, 'object');
		t.is(commandObject.action, requireFromIndex('tests/mocks/mock-commands/multi-functions-file.js'));
	});
});

/*-----------------------*/

test('deduce command name from files should rejecting with an error if the comment name is not formatted correctly', t => {
	const deduce = requireFromIndex('sources/deduce-command-object-from-file');

	t.plan(1)

	const fullPath = pathFromIndex('tests/mocks/mock-commands/badly-formatted-comment.js');
	return deduce(fullPath).then((k) => {
		t.fail();
	}).catch(err => {
		t.is(err.message, msg(
			`Cleanquirer found a comment format error in the command file "${fullPath}"`,
			`which made impossible to deduce the value of "name".`,
			`Please check that you are using a correct syntax when writting a documentation comment.`,
			`Error message from documentation.js is: Unknown content 'doc-name'.`
		));
	});
});