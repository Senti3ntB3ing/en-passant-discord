
import { Roles } from '../config.js';
import { createCommand, sendMessage } from '../parser.js';

createCommand({
	name: 'ping',
	aliases: [ 'pong' ],
	description: 'Pong!',
	permissions: Roles.everyone,
	execute: (bot, message) => {
		sendMessage(bot, message.channelId, {
			content: `Pong ${ Date.now() - message.timestamp }ms`
		});
	},
});
