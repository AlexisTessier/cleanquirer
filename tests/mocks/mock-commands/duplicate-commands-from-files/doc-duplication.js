'use strict';

/**
 * @name duplicate-command-name
 */
function docCommand({
	option
}) {
	docCommand.callCount++;
}

docCommand.callCount = 0;

module.exports = docCommand;