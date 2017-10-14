'use strict';

function callbackCalledWithAnUnvalidErrorCommand(options, callback) {
	setTimeout(()=>{
		callback(null, 'value-one', 'value-two')
	}, 20);
}

module.exports = callbackCalledWithAnUnvalidErrorCommand;