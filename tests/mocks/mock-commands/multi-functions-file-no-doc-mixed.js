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

function mainNoDocMixedCommand({
	option
}) {
	otherFunction();

	mainNoDocMixedCommand.callCount++;
}

mainNoDocMixedCommand.callCount = 0;

/**
 * @name other function-name-3
 */
function otherFunction3({
	option
}) {
}

module.exports = mainNoDocMixedCommand;

/**
 * @name another-function-name-4
 */
function otherFunction4({
	option
}) {
}