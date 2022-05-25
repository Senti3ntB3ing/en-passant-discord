
import { Roles } from '../config.js';
import { prefix, send, error } from '../parser.js';

prefix({
	name: 'shutdown', emoji: ':firecracker:', hidden: true,
	aliases: [ 'die' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async command => {
		await send(command.channelId, error(
			'Shutdown', 'The system is now offline.\n' +
			'The bot will be restarted automatically in `5m`.\n' +
			'If absolutely necessary you can restart it with this link:\n' +
			'https://en-passant.deno.dev/'
		));
		Deno.exit(1);
	}
});
