'use strict';

function callbackCalledWithMoreThanOneValue(options, callback) {
	setTimeout(()=>callback(null, 'value-one', 'value-two'), 20);
}

module.exports = callbackCalledWithMoreThanOneValue;