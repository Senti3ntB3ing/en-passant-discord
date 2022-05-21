
import { command, card, snow } from '../parser.js';

command({
	name: 'ping', emoji: ':ping_pong:', options: [],
	description: '🏓 Checks the latency of the bot.',
	execute: interaction => card(
		'Ping Command',
		`:ping_pong: **Pong**. Server latency: \`${
			Date.now() - snow(interaction.id)
		}ms\`.`
	),
});
