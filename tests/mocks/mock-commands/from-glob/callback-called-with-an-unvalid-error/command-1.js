'use strict';

function callbackCalledWithAnUnvalidError(options, callback) {
	setTimeout(()=>callback(2), 20);
}

module.exports = callbackCalledWithAnUnvalidError;