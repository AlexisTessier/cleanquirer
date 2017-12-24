'use strict';

const defaultVersionCommand = require('../default-commands/version');

module.exports = function makeDefaultCommands({
	cliName, version
}){
	return [
		defaultVersionCommand({cliName, version})
	].reduce((hashmap, command) => {
		hashmap[command.name] = command;
		return hashmap;
	}, {});
}