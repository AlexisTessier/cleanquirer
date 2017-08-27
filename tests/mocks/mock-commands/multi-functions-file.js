'use strict';

function otherFunction({
	option
} = {}) {
}

/**
 * @name other-function-name-2
 */
function otherFunction2({
	option
}) {
}

/**
 * @name main-doc-name
 */
function mainDocCommand({
	option
}) {
	otherFunction();

	mainDocCommand.callCount++;
}

mainDocCommand.callCount = 0;

/**
 * @name other function-name-3
 */
function otherFunction3({
	option
}) {
}

module.exports = mainDocCommand;

/**
 * @name another-function-name-4
 */
function otherFunction4({
	option
}) {
}