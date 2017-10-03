'use strict';

function rejectingPromiseCommand(options) {
	rejectingPromiseCommand.callCount++;

	return new Promise((resolve, reject) => {
		setTimeout(()=>{
			reject(new Error('rejecting-promise-command-error'))
		}, 200);
	});
}

rejectingPromiseCommand.callCount = 0;

module.exports = rejectingPromiseCommand;