'use strict';

function actionReturningAValueCommand(options, callback) {
	setTimeout(()=>{
		callback(null, 'glob file 2 action value from callback');
	}, 20);
}

module.exports = actionReturningAValueCommand;