
import { Roles } from '../config.js';
import { createCommand, text } from '../parser.js';

createCommand({
	name: 'ping', emoji: '🏓',
	aliases: [ 'pong' ],
	description: 'Check the latency of the bot.',
	permissions: Roles.everyone,
	execute: message => text(`Pong ${ Date.now() - message.timestamp }ms`)
});
