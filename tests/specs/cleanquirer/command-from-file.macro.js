'use strict';

const path = require('path');

const requireFromIndex = require('../../utils/require-from-index');

const mockCommandFile = require('../../mocks/mock-command-file');

/*---------------------------*/

function commandFromFileMacro(t, type, core) {
	const cleanquirer = requireFromIndex('sources/cleanquirer');
	const [template, skipExtension] = Array.isArray(type) ? type : [type, false];

	mockCommandFile(template).then(filepath => {
		const actionFunction = require(skipExtension === 'skipExtension' ? (
			path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)))
		): filepath);

		const myCli = cleanquirer({
			name: 'mycli',
			commands: [
				filepath
			]
		});

		core(t, myCli, actionFunction);
	});
}

commandFromFileMacro.title = providedTitle => (
	`Command from a file - ${providedTitle}`);

module.exports = commandFromFileMacro;