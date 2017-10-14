'use strict';

function actionWithAPromiseResolvingAValueCommand(options) {
	return Promise.resolve('file action value from promise');
}

module.exports = actionWithAPromiseResolvingAValueCommand;