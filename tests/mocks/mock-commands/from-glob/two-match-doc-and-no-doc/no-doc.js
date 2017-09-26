'use strict';

function twoMatchCommand({
	option
}) {
	twoMatchCommand.callCount++;
}

twoMatchCommand.callCount = 0;

module.exports = twoMatchCommand;