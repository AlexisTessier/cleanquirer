'use strict';

const test = require('ava');

const msg = require('@alexistessier/msg');

const requireFromIndex = require('../../utils/require-from-index');
const pathFromIndex = require('../../utils/path-from-index');

const commandFromFileMacro = require('./command-from-file.macro');

/*---------------------------*/

function wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro(t, wrongInput) {
	t.plan(2);

	commandFromFileMacro(t, 'doc.js', (t, myCli, actionFunction) => {
		const wrongCliInputError = t.throws(() => {
			myCli(wrongInput);
		});

		t.is(wrongCliInputError.message, msg(
			`When using mycli as a function, you must provide an`,
			`input to it as an Array like one from process.argv.slice(2).`
		));

		t.end();
	});
}

wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro.title = (providedTitle, input) => msg(
	`Synchronous usage - When defining command from file, throws error if provided input`,
	`is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`
);

function wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro(t, wrongInput) {
	t.plan(2);

	commandFromFileMacro(t, 'doc.js', (t, myCli, actionFunction) => {
		const wrongCliInputError = t.throws(() => {
			myCli(wrongInput).then(() => {
				t.fail();
			});
		});

		t.is(wrongCliInputError.message, msg(
			`When using mycli as a function, you must provide an input`,
			`to it as an Array like one from process.argv.slice(2).`
		));

		t.end();
	});
}

wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro.title = (providedTitle, input) => msg(
	`Promise usage - When defining command from file, throws error if provided input`,
	`is not valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`
);

function wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro(t, wrongInput) {
	t.plan(2);

	commandFromFileMacro(t, 'doc.js', (t, myCli, actionFunction) => {
		const wrongCliInputError = t.throws(() => {
			myCli(wrongInput, ()=>{
				t.fail();
			});
		});

		t.is(wrongCliInputError.message, msg(
			`When using mycli as a function, you must provide an input`,
			`to it as an Array like one from process.argv.slice(2).`
		));

		t.end();
	});
}

wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro.title = (providedTitle, input) => msg(
	`Callback usage - When defining command from file, throws error if provided input is not`,
	`valid like ${typeof input} - ${typeof input === 'object' ? JSON.stringify(input) : typeof input}`
);

/*---------------------------*/

function commandFromDocumentedFileSynchronouslyThrowingErrorMacro(t, core) {
	commandFromFileMacro(t, 'throwing-error-command.js', core);
}

commandFromDocumentedFileSynchronouslyThrowingErrorMacro.title = providedTitle => (
	`Command from documented command files synchronously throwing error - ${providedTitle}`);

/*---------------------------*/

function commandSynchronouslyCallingCallbackWithoutErrorFromDocumentedFileMacro(t, core) {
	commandFromFileMacro(t, 'synchronous-callback-call-without-error-command.js', core);
}

commandSynchronouslyCallingCallbackWithoutErrorFromDocumentedFileMacro.title = providedTitle => (
	`Command from documented command files synchronously calling the callback without error - ${providedTitle}`
);

/*---------------------------*/

function commandSynchronouslyCallingCallbackWithAnErrorFromDocumentedFileMacro(t, core) {
	commandFromFileMacro(t, 'synchronous-callback-call-with-error-command.js', core);
}

commandSynchronouslyCallingCallbackWithAnErrorFromDocumentedFileMacro.title = providedTitle => (
	`Command from documented command files synchronously calling the callback with an error - ${providedTitle}`
);

/*---------------------------*/

function commandInternallyUsingBothCallbackAndPromiseFromDocumentedFileMacro(t, core) {
	commandFromFileMacro(t, 'using-both-callback-and-promise-command.js', core);
}

commandInternallyUsingBothCallbackAndPromiseFromDocumentedFileMacro.title = providedTitle => (
	`Command using both internally callback and promise from file - ${providedTitle}`);

/*---------------------------*/

function commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackFromDocumentedFileMacro(t, core) {
	commandFromFileMacro(t, 'using-both-callback-and-promise-and-calling-the-callback-command.js', core);
}

commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackFromDocumentedFileMacro.title = providedTitle => (
	`Command using both internally callback and promise from file and calling the callback - ${providedTitle}`);

/*---------------------------*/

function commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyFromDocumentedFileMacro(t, core) {
	commandFromFileMacro(t, 'using-both-callback-and-promise-and-calling-the-callback-asynchronously-command.js', core);
}

commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyFromDocumentedFileMacro.title = providedTitle => (
	`Command using both internally callback and promise from file and calling the callback - ${providedTitle}`);

/*---------------------------*/

function commandFromFileAsynchronouslyCallingTheCallbackWithAnError(t, core) {
	commandFromFileMacro(t, 'asynchronous-callback-call-with-error-command.js', core);
}

commandFromFileAsynchronouslyCallingTheCallbackWithAnError.title = providedTitle => (
	`Command from documented command files asynchronously calling the callback with an error - ${providedTitle}`);

/*---------------------------*/

function commandReturningRejectingPromiseFromDocumentedFileMacro(t, core) {
	commandFromFileMacro(t, 'rejecting-promise-command.js', core);
}

commandReturningRejectingPromiseFromDocumentedFileMacro.title = providedTitle => (
	`Command returning rejecting Promise from documented file - ${providedTitle}`)

/*---------------------------*/

function wrongFilePathDefiningCommandFromFileMacro(t, errorMessage, wrongFilePath){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const commandWrongFilePathError = t.throws(()=>{
		cleanquirer({
			name: 'mycli',
			commands: [
				wrongFilePath
			]
		});
	});

	t.is(commandWrongFilePathError.message, errorMessage);
}

wrongFilePathDefiningCommandFromFileMacro.title = (providedTitle, wrongFilePath) => msg(
	`${providedTitle} - Synchronous usage - Error using a wrong filepath defining a`,
	`command from file - (${typeof wrongFilePath}) ${wrongFilePath}`
);

/*---------------------------*/

function commandFromNoJsFileMacro(t, wrongFile, errorMessageStart) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const noJsFilePath = pathFromIndex('tests/mocks/mock-commands', wrongFile);

	const noJsFileError = t.throws(()=>{
		cleanquirer({
			name: 'mycli',
			commands: [
				noJsFilePath
			]
		});
	});

	t.is(noJsFileError.message, msg(
		`"${noJsFilePath}" ${errorMessageStart}.`,
		`A valid command module file must be a javascript file (.js).`
	));
}

commandFromNoJsFileMacro.title = providedTitle => (
	`Using a no js file - ${providedTitle}`);

/*---------------------------*/
/*---------------------------*/
/*---------------------------*/

test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro);
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, undefined);
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, {});
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, 2);
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, true);
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, false);
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, null);
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, '  ');
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, 'wrong input');
test.cb(wrongCliInputWithCommandsDefinedFromFilesSynchronousUsageMacro, function func() {return;});

test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro);
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, undefined);
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, {});
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, 2);
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, true);
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, false);
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, null);
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, '  ');
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, 'wrong input');
test.cb(wrongCliInputWithCommandsDefinedFromFilesPromiseUsageMacro, function func() {return;});

test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro);
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, undefined);
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, {});
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, 2);
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, true);
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, false);
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, null);
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, '  ');
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, 'wrong input');
test.cb(wrongCliInputWithCommandsDefinedFromFilesCallbackUsageMacro, function func() {return;});

/*---------------------------*/

test.cb('Synchronous usage', commandFromDocumentedFileSynchronouslyThrowingErrorMacro, (t, myCli, actionFunction) => {
	myCli(['throwing-error-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end();
});

test.cb('Promise usage', commandFromDocumentedFileSynchronouslyThrowingErrorMacro, (t, myCli, actionFunction) => {
	t.plan(3);

	myCli(['throwing-error-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, `Error happen when using the mycli command "throwing-error-command" : throwing-error-command-error`);
		t.end();
	});
});

test.cb('Callback usage', commandFromDocumentedFileSynchronouslyThrowingErrorMacro, (t, myCli, actionFunction) => {
	t.plan(3);

	myCli(['throwing-error-command'], err => {
		t.truthy(err);
		t.is(actionFunction.callCount, 1);
		t.is(err.message, 'Error happen when using the mycli command "throwing-error-command" : throwing-error-command-error');
		t.end();
	});
});

/*---------------------------*/

test.cb('Synchronous usage', commandSynchronouslyCallingCallbackWithoutErrorFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	myCli(['synchronous-callback-call-without-error-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end()
});

test.cb('Promise usage', commandSynchronouslyCallingCallbackWithoutErrorFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['synchronous-callback-call-without-error-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`The mycli command "synchronous-callback-call-without-error-command" you are`,
			`trying to use calls internally a callback in a synchronous way.`,
			`This is not permitted by cleanquirer. If the command is synchronous,`,
			`it shouldn't use neither callback or promise.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

test.cb('Callback usage', commandSynchronouslyCallingCallbackWithoutErrorFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['synchronous-callback-call-without-error-command'], err => {
		t.truthy(err);
		t.is(actionFunction.callCount, 1);
		t.is(err.message, msg(
			`The mycli command "synchronous-callback-call-without-error-command" you are trying`,
			`to use calls internally a callback in a synchronous way. This is not permitted by cleanquirer.`,
			`If the command is synchronous, it shouldn't use neither callback or promise.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

/*---------------------------*/

test.cb('Synchronous usage', commandSynchronouslyCallingCallbackWithAnErrorFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	myCli(['synchronous-callback-call-with-error-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end()
});

test.cb('Promise usage', commandSynchronouslyCallingCallbackWithAnErrorFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['synchronous-callback-call-with-error-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`The mycli command "synchronous-callback-call-with-error-command" you are trying to use`,
			`calls internally a callback in a synchronous way. This is not permitted by cleanquirer.`,
			`If the command is synchronous, it shouldn't use neither callback or promise.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

test.cb('Callback usage', commandSynchronouslyCallingCallbackWithAnErrorFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['synchronous-callback-call-with-error-command'], err => {
		t.truthy(err);
		t.is(actionFunction.callCount, 1);
		t.is(err.message, msg(
			`The mycli command "synchronous-callback-call-with-error-command" you are trying to use`,
			`calls internally a callback in a synchronous way. This is not permitted by cleanquirer.`,
			`If the command is synchronous, it shouldn't use neither callback or promise.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

/*---------------------------*/

test.cb('Synchronous usage', commandInternallyUsingBothCallbackAndPromiseFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	myCli(['using-both-callback-and-promise-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end()
});

test.cb('Promise usage', commandInternallyUsingBothCallbackAndPromiseFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['using-both-callback-and-promise-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`The mycli command "using-both-callback-and-promise-command" you are trying to use both uses`,
			`internally a callback and returns a promise. This is not permitted by cleanquirer.`,
			`If the command is asynchronous, it must use callback or promise but not both.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

test.cb('Callback usage', commandInternallyUsingBothCallbackAndPromiseFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['using-both-callback-and-promise-command'], err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`The mycli command "using-both-callback-and-promise-command" you are trying to use both uses`,
			`internally a callback and returns a promise. This is not permitted by cleanquirer.`,
			`If the command is asynchronous, it must use callback or promise but not both.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

/*---------------------------*/

test.cb('Synchronous usage', commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	myCli(['using-both-callback-and-promise-and-calling-the-callback-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end()
});

test.cb('Promise usage', commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['using-both-callback-and-promise-and-calling-the-callback-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`The mycli command "using-both-callback-and-promise-and-calling-the-callback-command"`,
			`you are trying to use calls internally a callback in a synchronous way.`,
			`This is not permitted by cleanquirer.`,
			`If the command is synchronous, it shouldn't use neither callback or promise.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

test.cb('Callback usage', commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['using-both-callback-and-promise-and-calling-the-callback-command'], err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`The mycli command "using-both-callback-and-promise-and-calling-the-callback-command"`,
			`you are trying to use calls internally a callback in a synchronous way.`,
			`This is not permitted by cleanquirer.`,
			`If the command is synchronous, it shouldn't use neither callback or promise.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

/*---------------------------*/

test.cb('Synchronous usage', commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	myCli(['using-both-callback-and-promise-and-calling-the-callback-asynchronously-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end()
});

test.cb('Promise usage', commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(4);

	myCli(['using-both-callback-and-promise-and-calling-the-callback-asynchronously-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.true(err instanceof Error);
		t.is(err.message, msg(
			`The mycli command "using-both-callback-and-promise-and-calling-the-callback-asynchronously-command"`,
			`you are trying to use both uses internally a callback and returns a promise.`,
			`This is not permitted by cleanquirer.`,
			`If the command is asynchronous, it must use callback or promise but not both.`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		t.end();
	});
});

test.cb('Callback usage', commandInternallyUsingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(6);

	let callbackYetCalled = false;

	myCli(['using-both-callback-and-promise-and-calling-the-callback-asynchronously-command'], err => {
		if (!callbackYetCalled) {
			t.is(actionFunction.callCount, 1);
			t.true(err instanceof Error);
			t.is(err.message, msg(
				`The mycli command "using-both-callback-and-promise-and-calling-the-callback-asynchronously-command"`,
				`you are trying to use both uses internally a callback and returns a promise.`,
				`This is not permitted by cleanquirer. If the command is asynchronous, it must use`,
				`callback or promise but not both.`
			));
			t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
			callbackYetCalled = true;
		}
		else {
			t.is(actionFunction.callCount, 1);
			t.is(err, null);
			t.end();
		}
	});
});

/*---------------------------*/

test.cb('Callback usage', commandFromFileAsynchronouslyCallingTheCallbackWithAnError, (t, myCli, actionFunction) => {
	myCli(['asynchronous-callback-call-with-error-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end();
});

test.cb('Promise usage', commandFromFileAsynchronouslyCallingTheCallbackWithAnError, (t, myCli, actionFunction) => {
	t.plan(3);

	myCli(['asynchronous-callback-call-with-error-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`mycli asynchronous-callback-call-with-error-command error:`,
			`asynchronous-callback-call-with-error-command-error`
		));
		t.end();
	});
});

test.cb('Callback usage', commandFromFileAsynchronouslyCallingTheCallbackWithAnError, (t, myCli, actionFunction) => {
	t.plan(3);

	myCli(['asynchronous-callback-call-with-error-command'], err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, msg(
			`mycli asynchronous-callback-call-with-error-command error:`,
			`asynchronous-callback-call-with-error-command-error`
		));
		t.end();
	});
});

/*---------------------------*/

test.cb('Synchronous usage', commandReturningRejectingPromiseFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	myCli(['rejecting-promise-command']).catch(err => {return;});

	t.is(actionFunction.callCount, 0);
	t.end();
});

test.cb('Promise usage', commandReturningRejectingPromiseFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(3);

	myCli(['rejecting-promise-command']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, `mycli rejecting-promise-command error: rejecting-promise-command-error`);
		t.end();
	});
});

test.cb('Callback usage', commandReturningRejectingPromiseFromDocumentedFileMacro, (t, myCli, actionFunction) => {
	t.plan(3);

	myCli(['rejecting-promise-command'], err => {
		t.is(actionFunction.callCount, 1);
		t.truthy(err);
		t.is(err.message, `mycli rejecting-promise-command error: rejecting-promise-command-error`);
		t.end();
	});
});

/*---------------------------*/

test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "undefined" at index 0 is neither an object or an absolute path.`);
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "undefined" at index 0 is neither an object or an absolute path.`, undefined);
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "null" at index 0 is neither an object or an absolute path.`, null);
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "5" at index 0 is neither an object or an absolute path.`, 5);
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "${() => {return;}}" at index 0 is neither an object or an absolute path.`, ()=>{return;});
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command object at index 0 has no name.`, []);
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command object at index 0 has no name.`, {});
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "" at index 0 is not an absolute path.`, '');
test(wrongFilePathDefiningCommandFromFileMacro,
	`The provided mycli command path "non/absolute/path.js" at index 0 is not an absolute path.`, 'non/absolute/path.js');

/*---------------------------*/

function wrongFilePathDefiningCommandFromFileErrorOrderMacro(t, errorMessage, wrongFilePath){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const commandWrongFilePathError = t.throws(()=>{
		cleanquirer({
			name: 'mycli',
			commands: [
				wrongFilePath,
				wrongFilePath
			]
		});
	});

	t.is(commandWrongFilePathError.message, errorMessage);
}

wrongFilePathDefiningCommandFromFileErrorOrderMacro.title = (providedTitle, wrongFilePath) => msg(
	`${providedTitle} - Synchronous usage - Error using a wrong filepath`,
	`defining a command from file - (${typeof wrongFilePath}) ${wrongFilePath} - check errors order`
);

test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "undefined" at index 0 is neither an object or an absolute path.`);
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "undefined" at index 0 is neither an object or an absolute path.`, undefined);
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "null" at index 0 is neither an object or an absolute path.`, null);
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "5" at index 0 is neither an object or an absolute path.`, 5);
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "${()=>{return;}}" at index 0 is neither an object or an absolute path.`, ()=>{return;});
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command object at index 0 has no name.`, []);
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command object at index 0 has no name.`, {});
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "" at index 0 is not an absolute path.`, '');
test(wrongFilePathDefiningCommandFromFileErrorOrderMacro,
	`The provided mycli command path "non/absolute/path.js" at index 0 is not an absolute path.`, 'non/absolute/path.js');

/*---------------------------*/

function wrongFilePathDefiningCommandAtIndex1FromFileMacro(t, errorMessage, wrongFilePath){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const commandWrongFilePathError = t.throws(()=>{
		cleanquirer({
			name: 'mycli',
			commands: [
				{
					name: 'valid-command',
					action() {return;}
				},
				wrongFilePath
			]
		});
	});

	t.is(commandWrongFilePathError.message, errorMessage);
}

wrongFilePathDefiningCommandAtIndex1FromFileMacro.title = (providedTitle, wrongFilePath) => msg(
	`${providedTitle} - Synchronous usage - Error using a wrong filepath defining a command at`,
	`index 1 from file - (${typeof wrongFilePath}) ${wrongFilePath}`
);

test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "undefined" at index 1 is neither an object or an absolute path.`);
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "undefined" at index 1 is neither an object or an absolute path.`, undefined);
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "null" at index 1 is neither an object or an absolute path.`, null);
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "5" at index 1 is neither an object or an absolute path.`, 5);
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "${()=>{return;}}" at index 1 is neither an object or an absolute path.`, ()=>{return;});
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command object at index 1 has no name.`, []);
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command object at index 1 has no name.`, {});
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "" at index 1 is not an absolute path.`, '');
test(wrongFilePathDefiningCommandAtIndex1FromFileMacro,
	`The provided mycli command path "non/absolute/path.js" at index 1 is not an absolute path.`, 'non/absolute/path.js');

/*---------------------------*/

function usingNoFunctionModuleWhenDefineACommandFromFileMacro(t, type, modulePath){
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullModulePath = pathFromIndex('tests/mocks/mock-commands', modulePath);

	const noFunctionModuleError = t.throws(()=>{
		cleanquirer({
			name: 'mycli',
			commands: [
				fullModulePath
			]
		});
	});

	t.is(noFunctionModuleError.message, `${fullModulePath} exports ${type}. A valid command module file must export a function.`);
}

usingNoFunctionModuleWhenDefineACommandFromFileMacro.title = (providedTitle, type, modulePath) => (
	`${providedTitle} - error trying to use no function module in order to define a command from file - ${type} module`);

test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'object', 'object-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'object', 'array-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'string', 'empty-string-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'string', 'string-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'undefined', 'undefined-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'object', 'no-export-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'null', 'null-module.js');
test(usingNoFunctionModuleWhenDefineACommandFromFileMacro, 'number', 'number-module.js');

/*---------------------------*/

test('Error using a no js file defining a command from file',
	commandFromNoJsFileMacro, 'no-js.txt', 'is a .txt file');

test('Error using a no js file defining a command from file - skipping extension',
	commandFromNoJsFileMacro, 'no-js', 'has no extension');

/*---------------------------*/

test('Error using a file which contains a syntax error when defining a command from file', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const syntaxErrorFilePath = pathFromIndex('tests/mocks/mock-commands/syntax-error.js');
	const syntaxErrorFileError = t.throws(()=>{
		cleanquirer({
			name: 'mycli',
			commands: [
				syntaxErrorFilePath
			]
		});
	});

	t.is(syntaxErrorFileError.message, `Error with the file at path "${syntaxErrorFilePath}": Invalid or unexpected token`);
});

test('Error using an unhandled exports definition defining a command from file', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/unhandled-exports-file.js');
	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			fullPath
		]
	});


	return myCli(['unhandled-exports-file']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(err.message, `Cleanquirer doesn't found any exports node in the file "${fullPath}".`);
	});
});

test('Error using an unhandled exports type defining a command from file', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/unhandled-exports-type-file.js');
	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			fullPath
		]
	});

	return myCli(['unhandled-exports-type-file']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(err.message, `The file "${fullPath}" exports a node of type FunctionExpression. This type of exports is not handled by cleanquirer.`);
	});
});

test('Error using an unhandled exports origin defining a command from file', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/unhandled-exports-value-origin-file.js');
	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			fullPath
		]
	});

	return myCli(['unhandled-exports-value-origin-file']).then(()=>{
		t.fail();
	}).catch(err => {
		t.is(err.message, `Cleanquirer doesn't found the exports value node in the file "${fullPath}".`);
	});
});

test('Error using an file with badly formatted comment on command from file', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/badly-formatted-comment.js');
	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			fullPath
		]
	});

	return myCli(['badly-formatted-comment']).then(()=>{
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

test('undefined command handling', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(3);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/undefined-command-handling/doc.js');
	const actionFunction = require(fullPath);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [
			fullPath
		]
	});

	t.is(actionFunction.callCount, 0);

	try{
		await myCli(['doc-name']);

		t.is(actionFunction.callCount, 1);

		await myCli(['undefined-command']);
		t.fail();
	}
	catch(err){
		t.is(err.message, `The command "undefined-command" is not a command of "mycli".`);
	}
});

test('duplicate filepath handling', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const fullPath = pathFromIndex('tests/mocks/mock-commands/no-doc.js');

	const duplicateFilepathError = t.throws(() => {
		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				fullPath,
				fullPath
			]
		});
	});

	t.is(duplicateFilepathError.message, `"mycli" use a duplicate filepath "${fullPath}" in commands Array parameter at indexes 0 and 1 to define a command.`);
});

test('duplicate command handling', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(5);

	const fullPath = pathFromIndex('tests/mocks/mock-commands/duplicate-commands-from-files/doc.js');
	const fullPathBis = pathFromIndex('tests/mocks/mock-commands/duplicate-commands-from-files/doc-duplication.js');

	const actionFunction = require(fullPath);
	const actionFunctionBis = require(fullPathBis);

	const myCli = cleanquirer({
		name: 'myclifromfiles',
		commands: [
			fullPath,
			fullPathBis
		]
	});

	t.is(actionFunction.callCount, 0);
	t.is(actionFunctionBis.callCount, 0);

	try{
		await myCli(['duplicate-command-name']);
		t.fail();
	}
	catch(err){
		t.is(actionFunction.callCount, 0);
		t.is(actionFunctionBis.callCount, 0);

		t.is(err.message, msg(
			`"myclifromfiles" define a duplicate command "duplicate-command-name"`,
			`in commands Array parameter at indexes 0 (${fullPath}) and 1 (${fullPathBis}).`
		));
	}
});

/*---------------------*/

const callbackCalledWithMoreThanOneValueErrorMessage = msg(
	`The mycli command "callback-called-with-more-than-one-value" you are trying to use`,
	`calls internally a callback with more than one value (null, value-one, value-two).`,
	`This is not permitted by cleanquirer. If the command uses a callback,`,
	`it should only be called with a maximum of 2 arguments: one error or null`,
	`and one value eventually, like this: callback(err, 'a value').`
);

test.cb('Action with a callback called with more than one value - Synchronous usage',
	commandFromFileMacro, 'callback-called-with-more-than-one-value.js', async (t, myCli) => {
		t.plan(3);

		try{
			await myCli(['callback-called-with-more-than-one-value']);
			t.fail();
		}
		catch(err){
			t.true(err instanceof Error);
			t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage);
			t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
		}

		t.end();
	}
);

test.cb('Action with a callback called with more than one value - Callback usage', commandFromFileMacro, 'callback-called-with-more-than-one-value.js', async (t, myCli) => {
	t.plan(3);

	myCli(['callback-called-with-more-than-one-value'], err => {
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage);
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});

test.cb('Action with a callback called with more than one value - Promise usage', commandFromFileMacro, 'callback-called-with-more-than-one-value.js', async (t, myCli) => {
	t.plan(3);

	try{
		await myCli(['callback-called-with-more-than-one-value']);
		t.fail();
	}
	catch(err){
		t.true(err instanceof Error);
		t.is(err.message, callbackCalledWithMoreThanOneValueErrorMessage);
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');
	}

	t.end();
});

/*---------------------*/

const unvalidErrorMessage = (unvalidError => msg(
	`The mycli command "callback-called-with-an-unvalid-error" you are trying to use`,
	`calls internally a callback with a unvalid error value: (${typeof unvalidError}) ${unvalidError}. If the command uses a callback,`,
	`the error parameter at first position can only be null or undefined if no error, or an instance of Error,`,
	`like this: callback(new Error("An error message")).`,
	`If the command is supposed to call the callback with a value, it must use the second argument like this:`,
	`callback(null, 'command result')`
))('unvalid error');

test.cb('Action with a callback called with an unvalid error - Synchronous usage', commandFromFileMacro, 'callback-called-with-an-unvalid-error.js', async (t, myCli) => {
	t.plan(3);

	myCli(['callback-called-with-an-unvalid-error'], err => {
		t.true(err instanceof Error);
		t.is(err.message, unvalidErrorMessage);
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});

test.cb('Action with a callback called with an unvalid error - Callback usage', commandFromFileMacro, 'callback-called-with-an-unvalid-error.js', async (t, myCli) => {
	t.plan(3);

	myCli(['callback-called-with-an-unvalid-error'], err => {
		t.true(err instanceof Error);
		t.is(err.message, unvalidErrorMessage);
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});

test.cb('Action with a callback called with an unvalid error - Promise usage', commandFromFileMacro, 'callback-called-with-an-unvalid-error.js', async (t, myCli) => {
	t.plan(3);

	myCli(['callback-called-with-an-unvalid-error']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, unvalidErrorMessage);
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});

/*-----------------------*/

test.cb('Action with callback and returning a value', t => {
	t.plan(3);

	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'error-cli',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/action-with-callback-and-returning-a-value.js')
		]
	});

	myCli(['action-with-callback-and-returning-a-value']).then(()=>t.fail()).catch(err => {
		t.true(err instanceof Error);
		t.is(err.message, msg(
			`The error-cli command "action-with-callback-and-returning-a-value" you are trying to use both uses internally`,
			`a callback and returns a value (returned value) of type string. This is not permitted by cleanquirer.`,
			`If the command uses a callback, it must not return a value. Eventually, it can pass that`,
			`value as the second parameter of the callback like this: callback(null, resultValue)`
		));
		t.is(err.constructor.name, 'CleanquirerCommandImplementationError');

		t.end();
	});
});