
import { Option, command, card } from '../parser.js';
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
		const result = card(title, text);
		result.reactions = text.match(Emoji);
		console.log(result);
		return result;
    }
});
