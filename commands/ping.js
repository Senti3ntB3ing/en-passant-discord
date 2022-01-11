
import { Roles } from '../config.js';
import { createCommand, success } from '../parser.js';

createCommand({
	name: 'ping', emoji: '🏓',
	aliases: [ 'pong', 'latency' ],
	description: 'Check the latency of the bot.',
	permissions: Roles.everyone,
	execute: message => success(
		'Ping Command',
		`🏓 **Pong**. Server latency: \`${ Date.now() - message.timestamp }ms\`.`
	)
});
