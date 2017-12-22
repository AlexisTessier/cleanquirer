'use strict';

module.exports = function defaultVersionCommand({name, version}){
	return {
		name: 'version',
		action({
			stdout
		}){
			stdout.write(`${name} version ${version}\n`);

			return version;
		}
	}
}