'use strict';

module.exports = function msg(...strings) {
	return strings.map(s => s.trim()).join(' ');
};