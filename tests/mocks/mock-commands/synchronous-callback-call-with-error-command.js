'use strict';

function synchronousCallbackCallWithErrorCommand(options, callback) {
	synchronousCallbackCallWithErrorCommand.callCount++;

	callback(new Error(`synchronous-callback-call-with-error-command-error`));
}

synchronousCallbackCallWithErrorCommand.callCount = 0;

module.exports = synchronousCallbackCallWithErrorCommand;