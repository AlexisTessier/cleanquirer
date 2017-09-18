'use strict';

/**
 * @name one-match-command
 */
function oneMatchCommand({
	option
}) {
	oneMatchCommand.callCount++;
}

oneMatchCommand.callCount = 0;

module.exports = oneMatchCommand;