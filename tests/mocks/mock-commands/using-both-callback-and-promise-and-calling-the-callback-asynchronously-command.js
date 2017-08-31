'use strict';

function usingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyCommand(options, callback) {
	usingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyCommand.callCount++;

	setTimeout(()=>{
		callback();
	}, 500);

	return Promise.resolve();
}

usingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyCommand.callCount = 0;

module.exports = usingBothCallbackAndPromiseAndCallingTheCallbackAsynchronouslyCommand;