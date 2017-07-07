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
			action: cli.immersiveMode
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
 *
 * + name/action command object => DONE
 * + deduce commands from documented files
 * + name/action/options command object
 * + deduce options from documented files
 * + help command
 * + name/action/options/help command object
 * + deduce help from documented files
 * + options aliases
 * + deduce options aliases from documented files
 * + global options
 * + deduce global options from documented files
 * + command aliases
 * + deduce command aliases from documented files
 * + valid cases
 * + default command
 * + command timeout option
 * + deduce command timeout option from documented files
 */

require('../cli')().then( command => {
	console.log(`${command.name} done`);
}).catch(err => {throw err});