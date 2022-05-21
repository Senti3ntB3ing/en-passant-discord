
import {
	CommandTypes, command, error, card, messages, remove
} from '../parser.js';

command({
	name: 'clear', emoji: ':wastebasket:',
	description: '🗑 Clear messages in a text channel.',
	options: [{
		description: 'Number of messages to delete.',
		name: 'count', type: CommandTypes.Number,
		required: true, maxValue: 100, minValue: 1,
	}],
	execute: async interaction => {
		const limit = parseInt(interaction.data.options[0].value);
		try {
			const texts = await messages(interaction.channelId, { limit });
			await remove(interaction.channelId, texts.map(m => m.id), true);
		} catch {
			return error(
				'Clean Command', 'Internal error. Please try again later.',
			);
		}
		return card(
			'Clear Command',
			`:wastebasket: Successfully cleared \`${limit}\` messages.`
		);
	}
});
