'use strict';

function otherFunction({
	option
} = {}) {
}

function otherFunction2({
	option
}) {
}

function mainNoDocCommand({
	option
}) {
	mainNoDocCommand.callCount++;
	otherFunction();
}

mainNoDocCommand.callCount = 0;

function otherFunction3({
	option
}) {
}

module.exports = mainNoDocCommand;

function otherFunction4({
	option
}) {
}