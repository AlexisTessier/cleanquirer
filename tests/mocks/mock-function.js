'use strict';

const sinon = require('sinon');

function mockFunction() {
	return sinon.spy();
}

mockFunction.usingCallIndexes = () => {
	function mockCommand(){
		mockCommand.callCount++;
		mockCommand.callIndexes.push(global.cleanquirerTestGetCallIndex());
	}
	
	mockCommand.callCount = 0;
	mockCommand.callIndexes = [];

	return mockCommand;
}

module.exports = mockFunction;