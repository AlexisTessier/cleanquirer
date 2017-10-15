'use strict';

const test = require('ava');

const stream = require('stream');

const requireFromIndex = require('../../utils/require-from-index');

test('version option', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'version-cli',
		version: '2.8.1'
	});

	t.is(myCli.version, '2.8.1');
});

test('version command', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const buffer = [];
	const stdout = new stream.Writable({
		write(chunk, encoding, next) {
			buffer.push(chunk); next();
		}
	});

	const myCli = cleanquirer({
		name: 'version-cli',
		version: 'test-version-value',
		options: {
			stdout
		}
	});

	const versionFromCommand = await myCli(['version']);

	t.is(buffer.join(''), 'version-cli version test-version-value\n');

	t.is(myCli.version, 'test-version-value');
	t.is(versionFromCommand, 'test-version-value');
});

test('default version option', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const pkg = requireFromIndex('package.json');

	const buffer = [];
	const stdout = new stream.Writable({
		write(chunk, encoding, next) {
			buffer.push(chunk); next();
		}
	});

	const myCli = cleanquirer({
		name: 'v-cli',
		options: {
			stdout
		}
	});

	t.is(myCli.version, pkg.version);

	const versionFromCommand = await myCli(['version']);

	t.is(buffer.join(''), `v-cli version ${pkg.version}\n`);

	t.is(myCli.version, pkg.version);
	t.is(versionFromCommand, pkg.version);
});

test('throws error if trying to modify the cli.version property', t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'v-cli'
	});

	const err = t.throws(()=>{
		myCli.version = 'a-version-can-t-be-changed'
	});

	t.true(err instanceof TypeError);
	t.true(err.message.indexOf(`read only property 'version'`) >= 0);
});