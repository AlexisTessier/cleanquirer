'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const acorn = require('acorn');
const documentation = require('documentation');
const lineColumn = require('line-column');

function deduceCommandObjectFromFile(filepath) {
	assert(typeof filepath === 'string' && path.isAbsolute(filepath), `${filepath} is of type ${typeof filepath}. The filepath argument must be an absolute path.`);

	const extname = path.extname(filepath);

	if (extname.length === 0) {
		throw new Error(`"${filepath}" has no extension. Valid commands module file must be a javascript file (.js).`);
	}
	else if(extname !== '.js'){
		throw new Error(`"${filepath}" is a ${extname} file. Valid commands module file must be a javascript file (.js).`);
	}

	const action = require(filepath);

	assert(typeof action === 'function', `${filepath} exports ${action === null ? 'null' : typeof action}. Valid commands module file must export a function.`);

	return new Promise((resolve, reject) => {

		//defaults
		const commandObject = {
			name: path.basename(filepath, '.js'),
			action
		};

		getExportsValueComment(filepath).then(attachedComment => {
			let fromComment = {};

			if (attachedComment) {
				fromComment.name = getTagValue('name', attachedComment);
			}

			resolve(Object.assign({}, commandObject, fromComment));
		}).catch(err => {
			reject(err);
		});
	});
}

function getTagValue(title, comment) {
	assert(typeof title === 'string');
	assert(typeof comment === 'object');
	assert(Array.isArray(comment.tags));

	const tag = comment.tags.filter(tag => tag.title === title)[0] || {};

	return tag[title] || tag.description || null;
}

function getExportsValueComment(filepath) {
	assert(typeof filepath === 'string');

	return parseFile(filepath).then(ast => (new Promise((resolve, reject) => {
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
			return findNodeAttachedDoc(exportsValueNode, filepath).then(doc => resolve(doc)).catch(err => reject(err));
		}

		return resolve(null);
	})));
}

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

function findNodeAttachedDoc(node, filepath) {
	assert(typeof node === 'object');
	assert(typeof filepath === 'string');

	return new Promise((resolve, reject) => {
		let comments = null;
		let fileContent = null;

		Promise.all([
			documentation.build(filepath, {}).then(_comments => { comments = _comments }),
			getFileContent(filepath).then(_fileContent => { fileContent = _fileContent })
		]).then(()=>{

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

function getFileContent(filepath){
	assert(typeof filepath === 'string');

	getFileContent.cache = getFileContent.cache || {};

	return new Promise((resolve, reject) => {
		const cache = getFileContent.cache[filepath];

		if (cache) {
			resolve(cache)
		}
		else{
			fs.readFile(filepath, {encoding: 'utf-8'}, (err, content) => {
				if(err){
					reject(err)
				}
				else{
					getFileContent.cache[filepath] = content;
					resolve(content);
				}
			});
		}
	});
}

function parseFile(filepath){
	assert(typeof filepath === 'string');

	parseFile.cache = parseFile.cache || {};

	return new Promise((resolve, reject) => {
		const cache = parseFile.cache[filepath];

		if (cache) {
			resolve(cache)
		}
		else{
			getFileContent(filepath).then(content => {
				const ast = acorn.parse(content, {
					sourceType: 'module'
				});

				parseFile.cache[filepath] = ast;

				resolve(ast);
			}).catch(err => reject(err));
		}
	});
}

module.exports = deduceCommandObjectFromFile;