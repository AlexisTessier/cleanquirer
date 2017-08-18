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
}

/**
 * @name multi-comments-name-wrong
 */

module.exports = multiCommentsCommand;