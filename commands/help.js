
import { Color, Roles } from '../config.js';
import { createCommand, createHelp } from '../parser.js';

createCommand({
	name: 'help', emoji: '❓',
	aliases: [ 'usage', 'commands' ],
	description: 'Displays the help message',
	permissions: Roles.everyone,
	execute: _ => createHelp('Help', 'List of commands.', Color.green)
});
