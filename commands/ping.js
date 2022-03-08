
import { createCommand, card } from '../parser.js';

createCommand({
	name: 'ping', emoji: ':ping_pong:',
	aliases: [ 'pong', 'latency' ],
	description: 'Check the latency of the bot.',
	execute: message => card(
		'Ping Command',
		`:ping_pong: **Pong**. Server latency: \`${ Date.now() - message.timestamp }ms\`.`
	)
});
