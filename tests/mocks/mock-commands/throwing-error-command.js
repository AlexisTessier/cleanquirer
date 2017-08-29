'use strict';

function throwingErrorCommand() {
	throwingErrorCommand.callCount++;

	throw new Error('throwing-error-command-error')
}

throwingErrorCommand.callCount = 0;

module.exports = throwingErrorCommand;