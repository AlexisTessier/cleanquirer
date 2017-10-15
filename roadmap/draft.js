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
 * + deduce commands from documented files => DONE
 * + multiple commands definition from globs => DONE
 * + multiple commands definition => DONE
 * + undefined command handling => DONE
 * + stdout => DONE
 * + stderr => DONE
 * + stdin => DONE
 * + default stdout handling => DONE
 * + default stderr handling => DONE
 * + default stdin handling => DONE
 * + custom stdout handling => DONE
 * + custom stderr handling => DONE
 * + custom stdin handling => DONE
 * + duplicate command handling => DONE
 * + returning or resolving value from actions => DONE
 * + version option => DONE
 * + default version option => DONE
 * + version command => DONE
 * + override version command from object => DONE
 * + override version command from file => DONE
 * + override version command from glob => DONE
 * + pass the cli object to actions => DONE

 * release
 * -------
 * + name/action/options command object
 * + deduce options from documented files
 * + deduce options from documented files targeted with glob

 * release
 * -------
 * + prompt method option
 * + prompt method as cli property
 * + prompt method provided as option to each commands

 * release
 * -------
 * + auto prompt required options if undefined

 * release
 * -------
 * + help command
 * + description option and default description
 * + name/action/options/help command object
 * + deduce help from documented files
 * + deduce help from documented files targeted with glob

 * release
 * -------
 * + options aliases
 * + deduce options aliases from documented files
 * + deduce options aliases from documented files targeted with glob

 * release
 * -------
 * + global options
 * + deduce global options from documented files
 * + deduce global options from documented files targeted with glob

 * release
 * -------
 * + command aliases
 * + deduce command aliases from documented files
 * + deduce command aliases from documented files targeted with glob

 * release
 * -------
 * + valid cases

 * release
 * -------
 * + default command

 * release
 * -------
 * + command timeout option
 * + deduce command timeout option from documented files targeted with glob
 
 * release
 * -------
 * + extends command object

 * release
 * -------
 * + command can be a Promise resolving command object
 * + extends as Promise resolving command object

 * release
 * -------
 * + command object with filepath

 * release
 * -------
 * + command object with filepath and ignore comments option

 * release
 * -------
 * + command object with filepath and ignore some data from comments option

 * release
 * -------
 * + cleanquirer cli tool to generate command objects files from documented files

 * release
 * -------
 * + cleanquirer cli tool to generate a static cleanquirer config file from a cli function

 * release
 * -------
 * + cleanquirer cli tool to generate a new cleanquirer project

 * release
 * -------
 * + cleanquirer cli tool to generate a new cleanquirer project command

 * release
 * -------
 * + uniq stdout for each command
 * + uniq stderr for each command
 * + default uniq stdout handling for each command
 * + default uniq stderr handling for each command
 * + custom uniq stdout handling for each command
 * + custom uniq stderr handling for each command

 * release
 * -------
 * + cleanquirer cli tool to lint a cleanquirer project

 */

require('../cli')().then( command => {
	console.log(`${command.name} done`);
}).catch(err => {throw err});