'use strict';

function usingBothCallbackAndPromiseAndCallingTheCallbackCommand(options, callback) {
	usingBothCallbackAndPromiseAndCallingTheCallbackCommand.callCount++;

	callback();

	return Promise.resolve();
}

usingBothCallbackAndPromiseAndCallingTheCallbackCommand.callCount = 0;

module.exports = usingBothCallbackAndPromiseAndCallingTheCallbackCommand;