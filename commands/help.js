
import { Roles } from '../config.js';
import { createCommand, createHelp } from '../parser.js';

createCommand({
	name: 'help', emoji: '❓',
	aliases: [ 'usage' ],
	description: 'Displays the help message.',
	permissions: Roles.everyone,
	execute: _ => createHelp()
});
