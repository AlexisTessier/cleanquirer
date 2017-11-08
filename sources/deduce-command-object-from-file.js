'use strict';

const fs = require('fs-extra');
const path = require('path');
const assert = require('assert');

const pMemoize = require('p-memoize');
const acorn = require('acorn');
const documentation = require('documentation');
const lineColumn = require('line-column');

const msg = require('@alexistessier/msg');

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
	assert(typeof filepath === 'string' && path.isAbsolute(filepath),
		`${filepath} is of type ${typeof filepath}. The filepath argument must be an absolute path.`
	);

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
		throw new Error(
			`"${filepath}" has no extension. A valid command module file must be a javascript file (.js).`
		);
	}
	else if(extname !== '.js'){
		throw new Error(
			`"${filepath}" is a ${extname} file. A valid command module file must be a javascript file (.js).`
		);
	}

	let action = null;

	try{
		action = require(filepath);
	}
	catch(err){
		err.message = `Error with the file at path "${filepath}": ${err.message}`;
		throw err;
	}

	assert(typeof action === 'function', msg(
		`${filepath} exports ${action === null ? 'null' : typeof action}.`,
		`A valid command module file must export a function.`
	));

	//defaults
	const commandObject = {
		name: path.basename(filepath, '.js'),
		action
	};

	return getExportsValueComment(filepath).then(attachedComment => {
		let fromComment = {};

		if (attachedComment) {
			fromComment.name = getTagValue('name', attachedComment, filepath) || commandObject.name;
		}

		for(let key in fromComment){
			const value = fromComment[key];
			if (value instanceof Error) {
				return Promise.reject(value);
			}
		}

		return Promise.resolve(Object.assign({}, commandObject, fromComment));
	});
}

function getTagValue(title, comment, filepath) {
	assert(typeof title === 'string');
	assert(typeof comment === 'object');
	assert(Array.isArray(comment.tags));

	const tag = comment.tags.filter(tag => tag.title === title)[0] || {};

	if (Array.isArray(tag.errors) && tag.errors.length > 0) {
		return new Error(msg(
			`Cleanquirer found a comment format error in the command file "${filepath}"`,
			`which made impossible to deduce the value of "${title}".`,
			`Please check that you are using a correct syntax when writting a documentation comment.`,
			`Error message from documentation.js is: ${tag.errors[0]}.`
		));
	}

	return tag[title] || null;
}

function getExportsValueComment(filepath) {
	assert(typeof filepath === 'string');

	return parseFile(filepath).then(ast => {
		const exportsNode = findExportsNode(ast);

		if (!exportsNode) {
			return Promise.reject(new Error(
				`Cleanquirer doesn't found any exports node in the file "${filepath}".`
			));
		}

		const exportsType = exportsNode.right.type;

		let exportsValueNode = null;

		switch(exportsType){
			case 'Identifier':
				exportsValueNode = findIdentifierValueNode(exportsNode.right.name, ast);
				break;

			default:
				return Promise.reject(new Error(msg(
					`The file "${filepath}" exports a node of type ${exportsType}.`,
					`This type of exports is not handled by cleanquirer.`
				)));
		}

		return exportsValueNode ? findNodeAttachedDoc(exportsValueNode, filepath) : Promise.reject(new Error(
			`Cleanquirer doesn't found the exports value node in the file "${filepath}".`
		));
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
				const mainComment = matchingComments.reverse()[0];

				return Promise.resolve(mainComment);
			}
		}

		return Promise.resolve(null);
	});
}

module.exports = deduceCommandObjectFromFile;