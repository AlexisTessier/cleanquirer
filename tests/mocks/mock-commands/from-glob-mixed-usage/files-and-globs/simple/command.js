'use strict';

function noDocCommand({
	option
}) {
	noDocCommand.callCount++;
}

noDocCommand.callCount = 0;

module.exports = noDocCommand;