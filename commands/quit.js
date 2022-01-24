
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Roles } from '../config.js';
import { createCommand, error } from '../parser.js';

createCommand({
	name: 'quit', emoji: '🔌', hidden: true,
	aliases: [ 'shutdown', 'selfdestruct', 'self-destruct' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async message => {
		await sendMessage(message.bot, message.channelId, error(
			'Self Destruction', 'Shutting the system down...'
		));
		Deno.exit(1);
	}
});
