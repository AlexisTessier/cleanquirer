'use strict';

function usingBothCallbackAndPromiseCommand(options, callback) {
	usingBothCallbackAndPromiseCommand.callCount++;

	return Promise.resolve();
}

usingBothCallbackAndPromiseCommand.callCount = 0;

module.exports = usingBothCallbackAndPromiseCommand;