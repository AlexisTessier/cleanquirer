'use strict';

/**
 * @name from-deep-subfolder
 */
function fromDeepSubFolder({
	option
}) {
	fromDeepSubFolder.callCount++;
}

fromDeepSubFolder.callCount = 0;

module.exports = fromDeepSubFolder;