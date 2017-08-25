'use strict';

const fs = require('fs');
const assert = require('assert');

const tempWrite = require('temp-write');

const pathFromIndex = require('../utils/path-from-index');

module.exports = function mockCommandFile(template) {
	assert(typeof template === 'string');

	return tempWrite(fs.createReadStream(pathFromIndex('tests/mocks/mock-commands', template)), template);
}