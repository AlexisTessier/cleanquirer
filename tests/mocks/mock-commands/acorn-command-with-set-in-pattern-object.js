'use strict';

function command({set = 'mock set value'}) {
	return Promise.resolve(set); 
}

module.exports = command;