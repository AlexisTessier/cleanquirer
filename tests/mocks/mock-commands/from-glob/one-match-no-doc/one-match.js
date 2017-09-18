'use strict';

function oneMatchCommand({
	option
}) {
	oneMatchCommand.callCount++;
}

oneMatchCommand.callCount = 0;

module.exports = oneMatchCommand;