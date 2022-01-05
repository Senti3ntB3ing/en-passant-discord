
import { Color, Roles, Links } from '../config.js';
import { createCommand, card } from '../parser.js';

createCommand({
	name: 'club', emoji: '🏆',
	description: 'Invite link to the **chess.com** club.',
	permissions: Roles.everyone,
	execute: _ => card(
		'Invite link to the chess.com club',
		Links['chess.com'].url,
		Color.aqua
	)
});
