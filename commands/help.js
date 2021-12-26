
import { Color, Roles } from '../config.js';
import { createCommand, createHelp } from '../parser.js';

createCommand({
	name: 'help', emoji: '❓',
	aliases: [ 'usage', 'commands' ],
	description: 'Display the list of commands.',
	permissions: Roles.everyone,
	execute: _ => createHelp('List of Commands', Color.green)
});
