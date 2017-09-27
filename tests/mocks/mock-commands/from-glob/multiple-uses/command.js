'use strict';

/**
 * @name multiple-use-command
 */
function multipleUseCommand({
	option
}) {
	multipleUseCommand.callCount++;
}

multipleUseCommand.callCount = 0;

module.exports = multipleUseCommand;