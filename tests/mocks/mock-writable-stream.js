'use strict';

const stream = require('stream');

module.exports = function mockWritableStream(buffer = []) {
	return new stream.Writable({
		write(chunk, encoding, next) {
			buffer.push(chunk);
			next();
		}
	});
}