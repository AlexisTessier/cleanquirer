'use strict';

const path = require('path');
const assert = require('assert');

const documentation = require('documentation');

function getCommandInfosFromComments(comments){
	const commandObject = {};

	if (comments.length) {
		const commandFunctionComment = comments[0];

		commandObject.name = commandFunctionComment.name;
	}

	return commandObject;
}

function deduceCommandObjectFromFile(filepath) {
	assert(typeof filepath === 'string' && path.isAbsolute(filepath), `${filepath} is of type ${typeof filepath}. The filepath argument must be an absolute path.`);

	const action = require(filepath);

	assert(typeof action === 'function', `${filepath} exports ${action === null ? 'null' : typeof action}. Valid commands module file must export a function`);

	return new Promise((resolve, reject) => {

		//defaults
		const commandObject = {
			name: path.basename(filepath, '.js')
		};

		documentation.build(filepath, {}).then(comments => {
			const fromDoc = getCommandInfosFromComments(comments);

			resolve(Object.assign({}, commandObject, fromDoc));
		});
	});
}

module.exports = deduceCommandObjectFromFile;