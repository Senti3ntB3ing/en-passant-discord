
import { Roles } from '../config.js';
import { createCommand, text } from '../parser.js';

createCommand({
	name: 'ping',
	aliases: [ 'pong' ],
	description: 'Pong!',
	permissions: Roles.everyone,
	execute: (message) => text(`Pong ${ Date.now() - message.timestamp }ms`)
});
