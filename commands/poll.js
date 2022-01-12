
import { Roles, Prefix } from '../config.js';
import { createCommand, error, success, info } from '../parser.js';

import { sendMessage, addReaction, deleteMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

createCommand({
	name: 'poll', emoji: '📊', hidden: true,
	description: 'Make a poll with the given text and emojis.',
	permissions: Roles.moderator,
	execute: async (message, bot) => {
        const text = message.content.replace(/^(.*?)\s+/gm, '').trim();
		if (text == Prefix + 'poll') return info(
			'Community Poll Help',
			'ℹ️ You must provide text with some emojis for the poll.'
		);
		// extract emojis:
		const emojis = text.replace(/[*`~!_\(\)\[\]\{\}@,\.]+/g, '').match(/[\p{Emoji}\u200d]+/gu);
		let id = null;
		try {
			// send poll message:
			id = (await sendMessage(bot, message.channelId, success('Community Poll', text))).id;
			// add emoji reactions:
			for (const e of emojis) await addReaction(bot, message.channelId, id, e);
			// delete user message:
			await deleteMessage(bot, message.channelId, message.id);
		} catch {
			if (id != null) deleteMessage(bot, message.channelId, id);
			return error('Community Poll', '❌ Error: detected invalid emojis!');
		}
		return undefined;
    }
});
