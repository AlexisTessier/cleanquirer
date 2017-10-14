'use strict';

function callbackCalledWithMoreThanOneValueCommand(options, callback) {
	setTimeout(()=>{
		callback('unvalid error')
	}, 20);
}

module.exports = callbackCalledWithMoreThanOneValueCommand;