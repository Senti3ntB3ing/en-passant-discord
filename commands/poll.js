
import { Roles, ColorCodes } from '../config.js';
import { createCommand, error, card, info } from '../parser.js';

import { sendMessage, addReaction, deleteMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

createCommand({
	name: 'poll', emoji: ':bar_chart:', hidden: true,
	description: 'Make a poll with the given discord emojis.',
	permissions: Roles.moderator,
	execute: async message => {
		if (message.arguments.length == 0) return info(
			'Community Poll Help',
			'You must provide text with discord emojis for the poll.'
		);
		// extract emojis:
		const emojis = message.text.match(/`\s*:[A-Za-z0-9_]\w*:\s*`/gu).map(t => t.replace(/`|\s/g, ''));
		let id = null;
		try {
			// send poll message:
			id = (await sendMessage(message.bot, message.channelId, card(
				'Community Poll', message.text, ColorCodes.success
			))).id;
			// add emoji reactions:
			for (const e of emojis) await addReaction(message.bot, message.channelId, id, e);
			// delete user message:
			await deleteMessage(message.bot, message.channelId, message.id);
		} catch {
			if (id != null) deleteMessage(message.bot, message.channelId, id);
			return error('Community Poll', 'Detected invalid emojis or symbols!');
		}
		return undefined;
    }
});
