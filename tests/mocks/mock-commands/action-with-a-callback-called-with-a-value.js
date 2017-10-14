'use strict';

function actionWithACallbackCalledWithAValueCommand(options, callback) {
	setTimeout(() => callback(null, 'file action value from callback'), 20);
}

module.exports = actionWithACallbackCalledWithAValueCommand;