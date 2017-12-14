'use strict';

const test = require('ava');

const stream = require('stream');

const pathFromIndex = require('../../utils/path-from-index');
const requireFromIndex = require('../../utils/require-from-index');

const logs = requireFromIndex('sources/settings/logs');

test('version option', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'version-cli',
		version: '2.8.1'
	});

	t.is(myCli.version, '2.8.1');
});

test('version option with trimable string', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'version-cli',
		version: ' version name		'
	});

	t.is(myCli.version, 'version name');
});

test('version option with a integer', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'version-cli',
		version: 42
	});

	t.is(myCli.version, '42');
});

test('version option with a float', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'version-cli',
		version: 42.42
	});

	t.is(myCli.version, '42.42');
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

	t.is(myCli.version, 'unversioned');

	const versionFromCommand = await myCli(['version']);

	t.is(buffer.join(''), `v-cli version unversioned\n`);

	t.is(myCli.version, 'unversioned');
	t.is(versionFromCommand, 'unversioned');
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

test('override version command from object', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-version-override',
		version: 'start version',
		commands: [
			{
				name: 'version',
				action(){
					return 'override version'
				}
			}
		]
	});

	t.is(myCli.version, 'start version');

	const version = await myCli(['version']);

	t.is(myCli.version, 'start version');
	t.is(version, 'override version');
});

test('override version command from file', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-version-override',
		version: 'start version',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/override-version-command.js')
		]
	});

	t.is(myCli.version, 'start version');

	const version = await myCli(['version']);

	t.is(myCli.version, 'start version');
	t.is(version, 'override version from file');
});

function unvalidVersionMacro(t, unvalidValue) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const unvalidVersionError = t.throws(() => {
		cleanquirer({
			name: 'wrong-version-cli',
			version: unvalidValue
		});
	});

	t.is(unvalidVersionError.message, logs.unvalidVersion());
}

unvalidVersionMacro.title = providedTitle => (
	`version option with unvalid value - ${providedTitle}`
);

test('boolean true', unvalidVersionMacro, true);
test('boolean false', unvalidVersionMacro, false);
test('null', unvalidVersionMacro, null);
test('empty string', unvalidVersionMacro, '');
test('blank string', unvalidVersionMacro, '	 ');
test('blank string 2', unvalidVersionMacro, '  \n');
test('empty array', unvalidVersionMacro, []);
test('empty object', unvalidVersionMacro, {});
test('array', unvalidVersionMacro, ['hello']);
test('object', unvalidVersionMacro, {key: 'value'});
test('symbol', unvalidVersionMacro, Symbol('hello'));
test('empty symbol', unvalidVersionMacro, Symbol());
test('function', unvalidVersionMacro, function hello(){return;});

test('override version command from glob', async t => {
	const cleanquirer = requireFromIndex('sources/cleanquirer');

	const myCli = cleanquirer({
		name: 'cli-version-override',
		version: 'start version',
		commands: [
			pathFromIndex('tests/mocks/mock-commands/from-glob/override-version-command/*.js')
		]
	});

	t.is(myCli.version, 'start version');

	const version = await myCli(['version']);

	t.is(myCli.version, 'start version');
	t.is(version, 'override version from glob');
});