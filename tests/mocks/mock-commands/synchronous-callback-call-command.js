'use strict';

function synchronousCallbackCallCommand(options, callback) {
	synchronousCallbackCallCommand.callCount++;

	callback(new Error(`synchronous-callback-call-command-error`));
}

synchronousCallbackCallCommand.callCount = 0;

module.exports = synchronousCallbackCallCommand;