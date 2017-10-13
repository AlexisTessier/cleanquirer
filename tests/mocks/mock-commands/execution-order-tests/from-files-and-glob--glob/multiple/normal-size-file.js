'use strict';

/**
 * @name normal-size-file-glob
 */
function docCommand({
	option
}) {
	docCommand.callCount++;
	docCommand.callIndexes.push(global.cleanquirerTestGetCallIndex());
}

docCommand.callCount = 0;
docCommand.callIndexes = [];

module.exports = docCommand;