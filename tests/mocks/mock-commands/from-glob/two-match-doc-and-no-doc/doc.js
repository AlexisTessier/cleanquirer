'use strict';

/**
 * @name two-match-doc-command
 */
function twoMatchCommand({
	option
}) {
	twoMatchCommand.callCount++;
}

twoMatchCommand.callCount = 0;

module.exports = twoMatchCommand;