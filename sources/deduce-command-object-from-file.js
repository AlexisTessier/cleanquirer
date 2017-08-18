'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const acorn = require('acorn');
const documentation = require('documentation');

function getCommandInfosFromComment(comment){
	const commandObject = {};

	commandObject.name = comment.name;

	return commandObject;
}

function parseFile(filepath){
	const content = fs.readFileSync(filepath, {encoding: 'utf-8'});

	console.log('=====')
	const comments = [];
	const ast = acorn.parse(content, {
		sourceType: 'module',
		onComment: comments,
	});
	console.log(ast)
	console.log(comments)
}

function getComment(comments, filepath){
	const ast = parseFile(filepath);

	return null;
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
			let fromDoc = {};

			if (comments.length) {
				const comment = getComment(comments, filepath);
				fromDoc = comment ? getCommandInfosFromComment(comment) : fromDoc;
			}

			resolve(Object.assign({}, commandObject, fromDoc));
		});
	});
}

module.exports = deduceCommandObjectFromFile;