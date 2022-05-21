
import { command, card } from '../parser.js';

/*createCommand({
	name: 'ping', emoji: ':ping_pong:',
	aliases: [ 'pong', 'latency' ], rate: 2,
	description: 'Check the latency of the bot.',
	execute: message => card(
		'Ping Command',
		`:ping_pong: **Pong**. Server latency: \`${ Date.now() - message.timestamp }ms\`.`
	)
});*/

command({
	name: 'ping', emoji: ':ping_pong:', options: [],
	description: '🏓 Checks the latency of the bot.',
	execute: interaction => card(
		'Ping Command',
		`:ping_pong: **Pong**. Server latency: \`${ Date.now() - interaction.message.timestamp }ms\`.`
	),
});
