'use strict';

/**
 * @name from-root-command
 */
function fromRoot({
	option
}) {
	fromRoot.callCount++;
}

fromRoot.callCount = 0;

module.exports = fromRoot;