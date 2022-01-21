
import { Roles, ColorCodes } from '../config.js';
import { createCommand, error, card, info } from '../parser.js';

import { sendMessage, addReaction, deleteMessage } from 'https://deno.land/x/discordeno@13.0.0-rc18/mod.ts';

createCommand({
	name: 'poll', emoji: '📊', hidden: true,
	description: 'Make a poll with the given text and emojis.',
	permissions: Roles.moderator,
	execute: async message => {
        const text = message.text;
		if (message.arguments.length == 0) return info(
			'Community Poll Help',
			'You must provide text with some emojis for the poll.'
		);
		// extract emojis:
		const emojis = text.replace(/[*`~!_\(\)\[\]\{\}@,\.]+/g, '').match(/[\p{Emoji}\u200d]+/gu);
		let id = null;
		try {
			// send poll message:
			id = (await sendMessage(message.bot, message.channelId, card(
				'Community Poll', text, ColorCodes.success
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
