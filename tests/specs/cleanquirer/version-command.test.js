'use strict';

const test = require('ava');

const stream = require('stream');

const requireFromIndex = require('../../utils/require-from-index');

test('version option', async t => {
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

	t.is(myCli.version, 'test-version-value');

	const versionFromCommand = await myCli(['version']);

	t.is(buffer.join(''), 'version-cli version test-version-value\n');

	t.is(myCli.version, 'test-version-value');
	t.is(versionFromCommand, 'test-version-value');
});

test.todo('default version option');
test.todo('version command');

test.todo('throws error if trying to modify the cli.version property');