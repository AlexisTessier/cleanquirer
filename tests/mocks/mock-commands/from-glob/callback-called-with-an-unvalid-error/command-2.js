'use strict';

function callbackCalledWithAnUnvalidError(options, callback) {
	setTimeout(()=>callback(false), 20);
}

module.exports = callbackCalledWithAnUnvalidError;