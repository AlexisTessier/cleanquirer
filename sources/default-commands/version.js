'use strict';

module.exports = function defaultVersionCommand({cliName, version}){
	return {
		name: 'version',
		action({
			stdout
		}){
			stdout.write(`${cliName} version ${version}\n`);

			return version;
		}
	}
}