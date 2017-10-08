'use strict';

const stream = require('stream');

module.exports = function mockWritableStream() {
	return new stream.Writable({
		write(chunk, encoding, next) { next() }
	});
}