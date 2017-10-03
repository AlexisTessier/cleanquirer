'use strict';

/**
 * @name duplicate-command-name-from-two-glob
 */
function oneMatchCommand({
	option
}) {
	oneMatchCommand.callCount++;
}

oneMatchCommand.callCount = 0;

module.exports = oneMatchCommand;