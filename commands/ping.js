
import { Color, Roles } from '../config.js';
import { createCommand, card } from '../parser.js';

createCommand({
	name: 'ping', emoji: '🏓',
	aliases: [ 'pong', 'latency' ],
	description: 'Check the latency of the bot.',
	permissions: Roles.everyone,
	execute: message => card(
		'Ping Command',
		`🏓 Pong. Latency: \`${ Date.now() - message.timestamp }ms\`.`,
		Color.aqua
	)
});
