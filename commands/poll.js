
import {
	Option, command, error, card, send, react, remove
} from '../parser.js';
import { Emoji } from '../components/emoji.js';

command({
	name: 'poll', emoji: ':bar_chart:',
	description: '📊 Makes a poll with the given message.',
	options: [{
		description: 'Text to display in the poll',
		name: 'text', type: Option.String, required: true
	}],
	execute: async interaction => {
		const title = 'Community Poll';
		const text = interaction.data.options[0].value;
		const emojis = text.match(Emoji);
		const channel = interaction.channelId;
		let id = null;
		try {
			// send poll message:
			id = (await send(channel, card(title, text))).id;
			// add emoji reactions:
			for (const e of emojis) await react(channel, id, e);
		} catch {
			if (id != null) remove(id, channel);
			return error(title, 'Detected invalid emojis or symbols!');
		}
    }
});
