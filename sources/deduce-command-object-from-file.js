'use strict';

const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');

const pMemoize = require('p-memoize');
const acorn = require('acorn');
const documentation = require('documentation');
const lineColumn = require('line-column');

/*--------------*/

function _getFileContent(filepath){
	assert(typeof filepath === 'string');

	return fs.readFile(filepath, {encoding: 'utf-8'});
}

const getFileContent = pMemoize(_getFileContent);

function _parseFile(filepath){
	assert(typeof filepath === 'string');

	return getFileContent(filepath).then(content => Promise.resolve(acorn.parse(content, {
		sourceType: 'module'
	})));
}

const parseFile = pMemoize(_parseFile);

/*--------------*/

function deduceCommandObjectFromFile(filepath) {
	assert(typeof filepath === 'string' && path.isAbsolute(filepath), `${filepath} is of type ${typeof filepath}. The filepath argument must be an absolute path.`);

	let resolvedFilepath = null; 
	try{
		resolvedFilepath = require.resolve(filepath);
	}
	catch(err){
		resolvedFilepath = filepath;
	}
	finally{
		filepath = resolvedFilepath;
	}

	const extname = path.extname(filepath);

	if (extname.length === 0) {
		throw new Error(`"${filepath}" has no extension. Valid commands module file must be a javascript file (.js).`);
	}
	else if(extname !== '.js'){
		throw new Error(`"${filepath}" is a ${extname} file. Valid commands module file must be a javascript file (.js).`);
	}

	const action = require(filepath);

	assert(typeof action === 'function', `${filepath} exports ${action === null ? 'null' : typeof action}. Valid commands module file must export a function.`);


	//defaults
	const commandObject = {
		name: path.basename(filepath, '.js'),
		action
	};

	return getExportsValueComment(filepath).then(attachedComment => {
		let fromComment = {};

		if (attachedComment) {
			fromComment.name = getTagValue('name', attachedComment) || commandObject.name;
		}

		return Promise.resolve(Object.assign({}, commandObject, fromComment));
	});
}

function getTagValue(title, comment) {
	assert(typeof title === 'string');
	assert(typeof comment === 'object');
	assert(Array.isArray(comment.tags));

	const tag = comment.tags.filter(tag => tag.title === title)[0] || {};

	return tag[title] || null;
}

function getExportsValueComment(filepath) {
	assert(typeof filepath === 'string');

	return parseFile(filepath).then(ast => {
		const exportsNode = findExportsNode(ast);

		if (!exportsNode) {
			return Promise.reject(new Error(`Cleanquirer doesn't found any exports node in the file "${filepath}".`));
		}

		const exportsType = exportsNode.right.type;

		let exportsValueNode = null;

		switch(exportsType){
			case 'Identifier':
				exportsValueNode = findIdentifierValueNode(exportsNode.right.name, ast);
				break;

			default:
				return Promise.reject(new Error(`The file "${filepath}" exports a node of type ${exportsType}. This type of exports is not handled by cleanquirer.`));
		}

		return exportsValueNode ? findNodeAttachedDoc(exportsValueNode, filepath) : Promise.reject(
			new Error(`Cleanquirer doesn't found the exports value node in the file "${filepath}".`)
		);
	});
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
		))[0];
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

	let comments = null;
	let fileContent = null;

	return Promise.all([
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
				return Promise.resolve(matchingComments[0]);
			}
		}

		return Promise.resolve(null);
	})
}

module.exports = deduceCommandObjectFromFile;