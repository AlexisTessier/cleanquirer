'use strict';

/**
 * @name doc-name
 */
function docCommand({
	option
}) {
	docCommand.callCount++;
}

docCommand.callCount = 0;

module.exports = docCommand;