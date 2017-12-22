'use strict';

const test = require('ava');

const isStream = require('is-stream');

const stringable = require('stringable');

const requireFromIndex = require('../../utils/require-from-index');

const mockWritableStream = requireFromIndex('tests/mocks/mock-writable-stream');
const mockReadableStream = requireFromIndex('tests/mocks/mock-readable-stream');

const logs = requireFromIndex('sources/settings/logs');

test.cb('stdout is passed in the options object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [{
			name: 'command-one',
			action({
				stdout
			} = {}){
				t.true(isStream.writable(stdout));
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.cb('stderr is passed in the options object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [{
			name: 'command-one',
			action({
				stderr
			} = {}){
				t.true(isStream.writable(stderr));
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.cb('stdin is passed in the options object', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [{
			name: 'command-one',
			action({
				stdin
			} = {}){
				t.true(isStream.readable(stdin));
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.cb('default stdout stream', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [{
			name: 'command-one',
			action({
				stdout
			} = {}){
				t.is(stdout, process.stdout);
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.cb('default stderr stream', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [{
			name: 'command-one',
			action({
				stderr
			} = {}){
				t.is(stderr, process.stderr);
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.cb('default stdin stream', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		commands: [{
			name: 'command-one',
			action({
				stdin
			} = {}){
				t.is(stdin, process.stdin);
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.cb('custom stdout stream', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const customStdOut = mockWritableStream();

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		options: {
			stdout: customStdOut
		},
		commands: [{
			name: 'command',
			action({
				stdout
			} = {}){
				t.is(stdout, customStdOut);
				t.end();
			}
		}]
	});

	myCli(['command']);
});

test.cb('custom stderr stream', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const customStdErr = mockWritableStream();

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		options: {
			stderr: customStdErr
		},
		commands: [{
			name: 'command',
			action({
				stderr
			} = {}){
				t.is(stderr, customStdErr);
				t.end();
			}
		}]
	});

	myCli(['command']);
});

test.cb('custom stdin stream', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const customStdIn = mockReadableStream();

	t.plan(1);

	const myCli = cleanquirer({
		name: 'mycli',
		options: {
			stdin: customStdIn
		},
		commands: [{
			name: 'command',
			action({
				stdin
			} = {}){
				t.is(stdin, customStdIn);
				t.end();
			}
		}]
	});

	myCli(['command']);
});

/*---------------------*/

function unvalidCustomStdoutStreamMacro(t, unvalidStdout) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidStdoutError = t.throws(() => {
		cleanquirer({
			name: 'cli',
			options: {
				stdout: unvalidStdout
			}
		});
	});

	t.is(unvalidStdoutError.message, logs.unvalidStdout());
}

unvalidCustomStdoutStreamMacro.title = (providedTitle, unvalidStream) => (
	`${providedTitle} - an unvalidStdout stream should throw an error with ${stringable(unvalidStream)}`)

test('not writable stream', unvalidCustomStdoutStreamMacro, mockReadableStream());
test('Array', unvalidCustomStdoutStreamMacro, []);
test(unvalidCustomStdoutStreamMacro, {});
test(unvalidCustomStdoutStreamMacro, function func(){return;});
test(unvalidCustomStdoutStreamMacro, '');
test(unvalidCustomStdoutStreamMacro, '	 ');
test(unvalidCustomStdoutStreamMacro, 'string');
test(unvalidCustomStdoutStreamMacro, 42);
test(unvalidCustomStdoutStreamMacro, /regex/);
test(unvalidCustomStdoutStreamMacro, true);
test(unvalidCustomStdoutStreamMacro, false);
test(unvalidCustomStdoutStreamMacro, 0);
test(unvalidCustomStdoutStreamMacro, null);

/*---------------------*/

function unvalidCustomStdinStreamMacro(t, unvalidStdin) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidStdinError = t.throws(() => {
		cleanquirer({
			name: 'cli',
			options: {
				stdin: unvalidStdin
			}
		});
	});

	t.is(unvalidStdinError.message, logs.unvalidStdin());
}

unvalidCustomStdinStreamMacro.title = (providedTitle, unvalidStream) => (
	`${providedTitle} - an unvalidStdin stream should throw an error with ${stringable(unvalidStream)}`)

test('not readable stream', unvalidCustomStdinStreamMacro, mockWritableStream());
test('Array', unvalidCustomStdinStreamMacro, []);
test(unvalidCustomStdinStreamMacro, {});
test(unvalidCustomStdinStreamMacro, function func(){return;});
test(unvalidCustomStdinStreamMacro, '');
test(unvalidCustomStdinStreamMacro, '	 ');
test(unvalidCustomStdinStreamMacro, 'string');
test(unvalidCustomStdinStreamMacro, 42);
test(unvalidCustomStdinStreamMacro, /regex/);
test(unvalidCustomStdinStreamMacro, true);
test(unvalidCustomStdinStreamMacro, false);
test(unvalidCustomStdinStreamMacro, 0);
test(unvalidCustomStdinStreamMacro, null);

/*---------------------*/

function unvalidCustomStderrStreamMacro(t, unvalidStderr) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidStderrError = t.throws(() => {
		cleanquirer({
			name: 'cli',
			options: {
				stderr: unvalidStderr
			}
		});
	});

	t.is(unvalidStderrError.message, logs.unvalidStderr());
}

unvalidCustomStderrStreamMacro.title = (providedTitle, unvalidStream) => (
	`${providedTitle} - an unvalidStderr stream should throw an error with ${stringable(unvalidStream)}`)

test('not writable stream', unvalidCustomStderrStreamMacro, mockReadableStream());
test('Array', unvalidCustomStderrStreamMacro, []);
test(unvalidCustomStderrStreamMacro, {});
test(unvalidCustomStderrStreamMacro, function func(){return;});
test(unvalidCustomStderrStreamMacro, '');
test(unvalidCustomStderrStreamMacro, '	 ');
test(unvalidCustomStderrStreamMacro, 'string');
test(unvalidCustomStderrStreamMacro, 42);
test(unvalidCustomStderrStreamMacro, /regex/);
test(unvalidCustomStderrStreamMacro, true);
test(unvalidCustomStderrStreamMacro, false);
test(unvalidCustomStderrStreamMacro, 0);
test(unvalidCustomStderrStreamMacro, null);