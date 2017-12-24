'use strict';

module.exports = function getTypedValue(value, type) {
	if (type === 'number') {
		return parseFloat(value) || 0;
	}

	return value;
}