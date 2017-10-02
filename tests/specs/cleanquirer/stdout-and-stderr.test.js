'use strict';

const test = require('ava');
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
				t.true(Object.is(stdout, process.stdout));
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
				t.true(Object.is(stderr, process.stderr));
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
				t.true(Object.is(stdin, process.stdin));
				t.end();
			}
		}]
	});

	myCli(['command-one']);
});

test.todo('custom stdout handling');
test.todo('custom stderr handling');
test.todo('custom stdin handling');

test.todo('unvalid custom stdout handling');
test.todo('unvalid custom stdin handling');
test.todo('unvalid custom stderr handling');