'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const acorn = require('acorn');
const documentation = require('documentation');
const lineColumn = require('line-column');

function findExportsNode(ast) {
	assert(typeof ast === 'object');
	assert(Array.isArray(ast.body));

	return ast.body
		.filter(node => node.type === 'ExpressionStatement')
		.map(node => node.expression)
		.filter(node => node.type === 'AssignmentExpression' && node.operator === '=')
		.filter(node => (
			node.left.type === 'MemberExpression' &&
			node.left.object.type === 'Identifier' && node.left.object.name === 'module' &&
			node.left.property.type === 'Identifier' && node.left.property.name === 'exports'
		))[0] || null;
}

function findIdentifierValueNode(id, ast) {
	assert(typeof id === 'string');
	
	assert(typeof ast === 'object');
	assert(Array.isArray(ast.body));

	return ast.body
		.filter(node => {
			switch(node.type){
				case 'FunctionDeclaration':
					if (node.id.name === id) {
						return true;
					}
					break;

				default:
					break;
			}

			return false;
		})[0];
}

function parseFile(filepath){
	return new Promise((resolve, reject) => {
		fs.readFile(filepath, {encoding: 'utf-8'}, (err, content) => {
			if(err){reject(err)}
			else{
				resolve({
					ast: acorn.parse(content, {
						sourceType: 'module'
					}),
					raw: content
				})
			}
		});
	});
}

function findNodeAttachedDoc(node, fileContent, filepath) {
	return new Promise((resolve, reject) => {
		documentation.build(filepath, {}).then(comments => {
			if(comments.length){
				const nodePosition = lineColumn(fileContent, node.start);
				nodePosition.column = nodePosition.col - 1;

				const matchingComments = comments
					.filter(comment => comment.context.file === filepath)
					.filter(comment => (
						comment.context.loc.start.line === nodePosition.line &&
						comment.context.loc.start.column === nodePosition.column
					));

				if (matchingComments.length) {
					return resolve(matchingComments[0]);
				}
			}

			return resolve(null);
		}).catch(err => reject(err));
	});
}

function getExportsValueComment(filepath) {
	return parseFile(filepath).then(({ast, raw}) => (new Promise((resolve, reject) => {
		const exportsNode = findExportsNode(ast);
		const exportsType = exportsNode.right.type;

		let exportsValueNode = null;

		switch(exportsType){
			case 'Identifier':
				exportsValueNode = findIdentifierValueNode(exportsNode.right.name, ast);
				break;

			default:
				return reject(new Error(`The file "${filepath}" exports a node of type ${exportsType}. This type of exports not handled by cleanquirer.`));
				break;
		}

		if (exportsValueNode) {
			return findNodeAttachedDoc(exportsValueNode, raw, filepath).then(doc => resolve(doc)).catch(err => reject(err));
		}

		return resolve(null);
	})));
}

function getTag(title, tags) {
	const tag = tags.filter(tag => tag.title === title)[0] || {};

	return tag[title] || tag.description || null;
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

		getExportsValueComment(filepath).then(attachedDoc => {
			let fromDoc = {};

			if (attachedDoc) {
				const tags = attachedDoc.tags;
				
				fromDoc.name = getTag('name', tags);
			}

			resolve(Object.assign({}, commandObject, fromDoc));
		}).catch(err => {
			reject(err);
		});
	});
}

module.exports = deduceCommandObjectFromFile;