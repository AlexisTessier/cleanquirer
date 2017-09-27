'use strict';

const test = require('ava');

test.todo('Command definition from glob wrong cli input - synchronous usage');
test.todo('Command definition from glob wrong cli input - callback usage');
test.todo('Command definition from glob wrong cli input - promise usage');
test.todo('Command definition from no-matching glob');
test.todo('Command definition from glob matching extensionless files and/or directory');
test.todo('Command definition from glob matching no js files');
test.todo('Command definition from glob synchronously throwing error');
test.todo('Command definition from glob synchronously callback without error');
test.todo('Command definition from glob synchronously callback with error');
test.todo('Command definition from glob internally using both callback and promise');
test.todo('Command definition from glob internally using both callback and promise and calling the callback');
test.todo('Command definition from glob internally using both callback and promise and calling the callback asynchronously');
test.todo('Command definition from glob asynchronously calling the callback with an error');
test.todo('Command definition from glob returning rejecting promise');

test.todo('undefined command handling');
test.todo('duplicate glob handling');
test.todo('duplicate command handling');