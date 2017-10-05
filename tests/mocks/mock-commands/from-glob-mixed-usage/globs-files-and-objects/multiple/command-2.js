'use strict';

/**
 * @name doc-command-2
 */
function docCommand({
	option
}) {
	docCommand.callCount++;
}

docCommand.callCount = 0;

module.exports = docCommand;