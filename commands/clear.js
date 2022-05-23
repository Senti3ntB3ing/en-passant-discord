
import { Option, Permission, command, error, card, clear } from '../parser.js';

command({
	name: 'clear', emoji: ':wastebasket:',
	description: '🗑 Clear messages in a text channel.',
	options: [{
		description: 'Number of messages to delete.',
		name: 'count', type: Option.Number,
		required: true, maxValue: 100, minValue: 1,
	}],
	permissions: [ Permission.MANAGE_MESSAGES ],
	execute: async interaction => {
		const limit = parseInt(interaction.data.options[0].value);
		try { await clear(interaction.channelId, limit); }
		catch {
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
