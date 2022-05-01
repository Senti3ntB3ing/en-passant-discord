
import { sendMessage, editMessage } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { Roles, Time, delay } from '../config.js';
import { createCommand, error } from '../parser.js';

createCommand({
	name: 'shutdown', emoji: ':firecracker:', hidden: true,
	aliases: [ 'die' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async command => {
		await sendMessage(command.bot, command.channelId, error(
			'Self Destruction', 'The system has completed the self-destruction sequence.'
		));
		Deno.exit(1);
	}
});
