'use strict';

const stream = require('stream');

module.exports = function mockReadableStream() {
	return new stream.Readable({
		read() {}
	});
}