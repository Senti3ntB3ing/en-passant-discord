
import { ColorCode, Roles } from '../config.js';
import { createCommand, card } from '../parser.js';

createCommand({
	name: 'poll', emoji: '📊', hidden: true,
	description: 'Make a poll with the given text and emojis.',
	permissions: Roles.moderator,
	execute: message => {
        const text = message.replace(/^(.*?)\s+/gm, '').trim();
		if (text == '') return card(
			'Poll Command Help',
			'ℹ️ You must provide text with some emojis for the poll.'
		);
		// extract emojis:
		const emojis = text.match(/<(a)?:.+?:(\d+)>/g);
		console.log(text);
    }
});
