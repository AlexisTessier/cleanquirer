'use strict';

function actionReturningAValueCommand() {
	return Promise.resolve('glob file 1 action value from promise');
}

module.exports = actionReturningAValueCommand;