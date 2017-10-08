'use strict';

const test = require('ava');

const stream = require('stream');
const isStream = require('is-stream');

const requireFromIndex = require('../../utils/require-from-index');

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

	const customStdOut = new stream.Writable({
		write(chunk, encoding, next) { next() }
	});

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

	const customStdErr = new stream.Writable({
		write(chunk, encoding, next) { next() }
	});

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

	const customStdIn = new stream.Readable({
		read() {}
	});

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

test.todo('unvalid custom stdout stream');
test.todo('unvalid custom stdin stream');
test.todo('unvalid custom stderr stream');