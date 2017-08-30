'use strict';

const path = require('path');

const cleanquirer = require('cleanquirer');

const cli = cleanquirer({
	name: 'cli',
	options: [{
		name: 'optionName',
		description: 'a description',
		hook(value = 'defaultValue', next) {
			next(null, 'value')
		}
	}],
	commands: [
		path.join(__dirname, 'commands/*.js'),
		'module/simple-action.js',
		{
			name: 'enter',
			extends: cli.immersiveMode
		},
		{
			name: 'action',
			action(){
				return new Promise()
			}
		},
		{
			name: 'other',
			help: 'do something',
			options: [{
				name: 'optionName'
			}],
			action(options, done) {
				console.log('make action');
			}
		}, {
			name: 'default',
			alias: 'exec'
		}
	],
	validCases: ['camelCase', 'snake_case', 'kebab-case']
});

module.exports = cli;

/**
 * TO DO
 * -----

 * release
 * -------
 * + name/action command object => DONE
 * + deduce commands from documented files => deduce function ok, need to make it work from cleanquirer
 * + multiple commands definition
 * + version option
 * + default version option
 * + version command
 * + undefined command handling
 * + optimisation => only wait for the required command to be ready before running cli

 * release
 * -------
 * + name/action/options command object
 * + deduce options from documented files

 * release
 * -------
 * + help command
 * + description option and default description
 * + name/action/options/help command object
 * + deduce help from documented files

 * release
 * -------
 * + options aliases
 * + deduce options aliases from documented files

 * release
 * -------
 * + global options
 * + deduce global options from documented files

 * release
 * -------
 * + command aliases
 * + deduce command aliases from documented files

 * release
 * -------
 * + valid cases

 * release
 * -------
 * + default command

 * release
 * -------
 * + command timeout option
 * + deduce command timeout option from documented files
 
 * release
 * -------
 * + extends command object

 * release
 * -------
 * + extends as Promise resolving command object

 */

require('../cli')().then( command => {
	console.log(`${command.name} done`);
}).catch(err => {throw err});