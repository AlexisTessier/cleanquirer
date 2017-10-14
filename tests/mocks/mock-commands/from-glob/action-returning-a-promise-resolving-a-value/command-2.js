'use strict';

function actionReturningAValueCommand() {
	return Promise.resolve('glob file 2 action value from promise');
}

module.exports = actionReturningAValueCommand;