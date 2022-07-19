
import { Option, command, card } from '../parser.js';
import { Emoji } from '../components/emoji.js';

command({
	name: 'poll', emoji: ':bar_chart:',
	description: '📊 Makes a poll with the given message.',
	options: [{
		description: 'Text to display in the poll',
		name: 'text', type: Option.String, required: true
	}, {
		description: 'Title of the poll',
		name: 'text', type: Option.String, required: false
	}],
	execute: interaction => {
		const options = interaction.data.options;
		const title = options.length == 2 ? options[1].value : 'Community Poll';
		const text = options[0].value;
		const result = card(title, text);
		result.reactions = text.match(Emoji) ?? [];
		return result;
    }
});
