
import { sendMessage, editMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

import { Roles, delay } from '../config.js';
import { createCommand, error } from '../parser.js';

createCommand({
	name: 'shutdown', emoji: '🔌', hidden: true,
	aliases: [ 'selfdestruct', 'self-destruct' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async command => {
		const title = 'Self Destruction';
		let message = await sendMessage(command.bot, command.channelId, error(
			title, 'The system will self-destruct in `10` seconds.'
		));
		await delay(1000);
		for (let i = 9; i > 0; i--) {
			await editMessage(command.bot, message.channelId, message.id, error(
				title, 'The system will self-destruct in `0' + i + '` seconds.'
			));
			await delay(1000);
		}
		await editMessage(command.bot, message.channelId, message.id, error(
			title, 'The system has completed the self-destruction sequence.'
		));
		Deno.exit(1);
	}
});
