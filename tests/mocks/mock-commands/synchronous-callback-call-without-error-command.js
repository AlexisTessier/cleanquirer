'use strict';

function synchronousCallbackCallWithoutErrorCommand(options, callback) {
	synchronousCallbackCallWithoutErrorCommand.callCount++;

	callback();
}

synchronousCallbackCallWithoutErrorCommand.callCount = 0;

module.exports = synchronousCallbackCallWithoutErrorCommand;