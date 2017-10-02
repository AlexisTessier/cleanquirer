'use strict';

function asynchronousCallbackCallWithErrorCommand(options, callback) {
	asynchronousCallbackCallWithErrorCommand.callCount++;

	setTimeout(()=>{
		callback(new Error(`asynchronous-callback-call-with-error-command-error`));
	}, 200);
}

asynchronousCallbackCallWithErrorCommand.callCount = 0;

module.exports = asynchronousCallbackCallWithErrorCommand;