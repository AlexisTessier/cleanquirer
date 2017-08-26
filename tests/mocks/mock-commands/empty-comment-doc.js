'use strict';

/**
 *
 */
function command() {
	command.callCount++;
}

command.callCount = 0;

module.exports = command;