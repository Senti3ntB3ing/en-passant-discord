
import { Roles } from '../config.js';
import { createCommand, card, error } from '../parser.js';

import { sendMessage, addReaction } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

createCommand({
	name: 'poll', emoji: '📊', hidden: true,
	description: 'Make a poll with the given text and emojis.',
	permissions: Roles.moderator,
	execute: async (message, bot) => {
        const text = message.content.replace(/^(.*?)\s+/gm, '').trim();
		if (text == '') return card(
			'Poll Command Help',
			'ℹ️ You must provide text with some emojis for the poll.'
		);
		// extract emojis:
		const emojis = text.match(/[\p{Emoji}\u200d]+/gu);
		try {
			const id = (await sendMessage(bot, message.channelId, text)).id;
			for (const e of emojis) await addReaction(bot, message.channelId, id, e);
		} catch (e) {
			return error('Poll Command', '❌ Error: detected invalid emojis!');
		}
		return undefined;
    }
});
