'use strict';

// wrong comment

/**
 * @name multi-comments-name
 */
function multiCommentsCommand({
	option
}) {
	// wrong comment

	/**
	 * @name wrong-multi-comments-name
	 */
	function wrong() {
	}

	multiCommentsCommand.callCount++;
}

multiCommentsCommand.callCount = 0;

/**
 * @name multi-comments-name-wrong
 */

module.exports = multiCommentsCommand;