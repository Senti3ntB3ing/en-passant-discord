
import { sendMessage, editMessage } from 'https://deno.land/x/discordeno@13.0.0-rc34/mod.ts';

import { Roles, Time, delay } from '../config.js';
import { createCommand, error } from '../parser.js';

createCommand({
	name: 'shutdown', emoji: ':firecracker:', hidden: true,
	aliases: [ 'die' ],
	description: 'Shutdown the bot.',
	permissions: Roles.moderator,
	execute: async command => {
		const title = 'Self Destruction';
		let message = await sendMessage(command.bot, command.channelId, error(
			title, 'Preparing the system for the self-destruction sequence.'
		));
		await delay(Time.second);
		for (let i = 10; i > 0; i--) {
			const j = String(i).padStart(2, '0');
			await editMessage(command.bot, message.channelId, message.id, error(
				title, 'The system will self-destruct in `' + j + '` seconds.'
			));
			await delay(Time.second);
		}
		await editMessage(command.bot, message.channelId, message.id, error(
			title, 'The system has completed the self-destruction sequence.'
		));
		Deno.exit(1);
	}
});
