'use strict';

/**
 * @name from-subfolder-documented-command
 */
function fromSubFolder2({
	option
}) {
	fromSubFolder2.callCount++;
}

fromSubFolder2.callCount = 0;

module.exports = fromSubFolder2;