'use strict';

// wrong comment

/**
 * @name multi-wrong-name-command
 */

/**
 * @name multi-comments-name
 */
function multiTopCommentsCommand({
	option
}) {
	// wrong comment

	/**
	 * @name wrong-multi-comments-name
	 */
	function wrong() {
	}

	multiTopCommentsCommand.callCount++;
}

multiTopCommentsCommand.callCount = 0;

/**
 * @name multi-comments-name-wrong
 */

module.exports = multiTopCommentsCommand;