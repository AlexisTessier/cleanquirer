'use strict';

const sinon = require('sinon');

module.exports = function mockFunction() {
	return sinon.spy();
}