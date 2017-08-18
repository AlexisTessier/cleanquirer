'use strict';

function otherFunction1({
	option
}) {
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
}

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