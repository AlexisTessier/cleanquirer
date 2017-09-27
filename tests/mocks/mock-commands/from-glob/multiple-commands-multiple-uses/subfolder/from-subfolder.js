'use strict';

function fromSubFolder({
	option
}) {
	fromSubFolder.callCount++;
}

fromSubFolder.callCount = 0;

module.exports = fromSubFolder;