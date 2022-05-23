
import { Roles } from '../config.js';
import { createCommand, send, error } from '../parser.js';

createCommand({
	name: 'shutdown', emoji: ':firecracker:', hidden: true,
	aliases: [ 'die' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async command => {
		await send(command.channelId, error(
			'Shutdown', 'The system is now offline.'
		));
		Deno.exit(1);
	}
});
