
import { sendMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Roles } from '../config.js';
import { createCommand, error } from '../parser.js';

createCommand({
	name: 'shutdown', emoji: '🔌', hidden: true,
	aliases: [ 'selfdestruct', 'self-destruct' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async message => {
		await sendMessage(message.bot, message.channelId, error(
			'Self Destruction', 'Preparing the system for self-destruction shutdown...'
		));
		Deno.exit(1);
	}
});
