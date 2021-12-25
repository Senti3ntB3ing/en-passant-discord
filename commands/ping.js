
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';
import { Roles } from '../config.js';
import { createCommand } from '../parser.js';

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
